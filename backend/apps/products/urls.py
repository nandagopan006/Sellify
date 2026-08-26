from django.urls import path

from .views import ProductListCreateView,ProductDetailView


urlpatterns = [
    path("", ProductListCreateView.as_view(), name="product-list-create"),
     path("<int:product_id>/",ProductDetailView.as_view(),name="product-detail",
    ),
]