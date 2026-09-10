from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductSerializer
from .checkout_serializers import CheckoutSerializer
from django.db import transaction
from decimal import Decimal


def parse_price_filter(raw_value, field_name):
    """Reads a ?min_price= / ?max_price= value coming from the URL.

    Everything in a query string is text, so "abc" arrives here just as easily
    as "500". Handing that straight to the database raises an error and Django
    turns it into a 500, so we check it first.

    Returns a (price, error_message) pair. Only one of the two is ever filled in.
    """
    try:
        price = Decimal(raw_value)
    except (ArithmeticError, TypeError, ValueError):
        return None, f"{field_name} must be a number."

    # Decimal happily accepts "NaN" and "Infinity", which would break the query.
    if not price.is_finite():
        return None, f"{field_name} must be a number."

    if price < 0:
        return None, f"{field_name} cannot be negative."

    return price, None


class ProductListCreateView(APIView):
    
    def get_permissions(self):
        if self.request.method =="GET":
            return [AllowAny()]
        
        return [IsAuthenticated()]
            

    def get(self, request):
        products = Product.objects.filter(is_sold=False)

        category = request.query_params.get("category")
        min_price_raw = request.query_params.get("min_price")
        max_price_raw = request.query_params.get("max_price")

        if category:
            products = products.filter(category__iexact=category.strip())

        # Check both prices before either of them touches the database.
        min_price = None
        max_price = None

        if min_price_raw:
            min_price, error = parse_price_filter(min_price_raw, "min_price")

            if error:
                return Response(
                    {"message": error},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if max_price_raw:
            max_price, error = parse_price_filter(max_price_raw, "max_price")

            if error:
                return Response(
                    {"message": error},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # A backwards range can only ever return nothing, so say so instead of
        # showing an empty page and letting the user wonder why.
        if min_price is not None and max_price is not None and min_price > max_price:
            return Response(
                {"message": "min_price cannot be greater than max_price."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if min_price is not None:
            products = products.filter(price__gte=min_price)

        if max_price is not None:
            products = products.filter(price__lte=max_price)

        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            product = serializer.save(seller=request.user)

            return Response(
                ProductSerializer(product).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Product creation failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
        
class ProductDetailView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAuthenticated()]

    def get_product(self, product_id):
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return None

    def get(self, request, product_id):
        product = self.get_product(product_id)

        if product is None:
            return Response(
                {"message": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProductSerializer(product)

        return Response(serializer.data)

    def put(self, request, product_id):
        product = self.get_product(product_id)

        if product is None:
            return Response(
                {"message": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if product.seller != request.user:
            return Response(
                {"message": "You cannot update this product."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ProductSerializer(
            product,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            {
                "message": "Product update failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, product_id):
        product = self.get_product(product_id)

        if product is None:
            return Response(
                {"message": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if product.seller != request.user:
            return Response(
                {"message": "You cannot delete this product."},
                status=status.HTTP_403_FORBIDDEN,
            )

        product.delete()

        return Response(
            {"message": "Product deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )

class MyProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(
            seller=request.user
        )

        serializer = ProductSerializer(
            products,
            many=True,
        )

        return Response(serializer.data)       


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "message": "Checkout failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        items = serializer.validated_data["items"]
        product_ids = []
        quantities = {}

        for item in items:
            product_ids.append(item["product_id"])
            quantities[item["product_id"]] = item["quantity"]

        with transaction.atomic():
            products = Product.objects.filter(
                id__in=product_ids,
                is_sold=False,
            )

            if products.count() != len(product_ids):
                return Response(
                    {
                        "message": "One or more products are unavailable."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            for product in products:
                if product.seller == request.user:
                    return Response(
                        {
                            "message": (
                                "You cannot purchase your own product."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                quantity = quantities[product.id]
                if product.stock < quantity:
                    return Response(
                        {
                            "message": (
                                f"Only {product.stock} of {product.title} "
                                "are available."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            for product in products:
                product.stock -= quantities[product.id]
                product.is_sold = product.stock == 0
                product.save(
                    update_fields=["stock", "is_sold"]
                )

        return Response(
            {
                "message": "Checkout successful.",
                "items": items,
            },
            status=status.HTTP_200_OK,
        )
