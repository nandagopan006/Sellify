from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductSerializer
from .checkout_serializers import CheckoutSerializer
from django.db import transaction


class ProductListCreateView(APIView):
    
    def get_permissions(self):
        if self.request.method =="GET":
            return [AllowAny()]
        
        return [IsAuthenticated()]
            

    def get(self, request):
        products = Product.objects.filter(is_sold=False)
        
        category = request.query_params.get("category")
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")

        if category:
            products = products.filter(category__iexact=category)

        if min_price:
            products = products.filter(price__gte=min_price)

        if max_price:
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

        product_ids = serializer.validated_data["product_ids"]

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

                if product.stock < 1:
                    return Response(
                        {
                            "message": (
                                f"{product.title} is out of stock."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            for product in products:
                product.stock = 0
                product.is_sold = True
                product.save(
                    update_fields=["stock", "is_sold"]
                )

        return Response(
            {
                "message": "Checkout successful.",
                "product_ids": product_ids,
            },
            status=status.HTTP_200_OK,
        )
