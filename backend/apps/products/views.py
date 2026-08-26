from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductSerializer


class ProductListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(is_sold=False)

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
    permission_classes = [IsAuthenticated]

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