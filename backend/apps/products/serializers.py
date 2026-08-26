import re
from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    seller = serializers.ReadOnlyField(source="seller.username")

    class Meta:
        model = Product
        fields = [
            "id",
            "seller",
            "title",
            "description",
            "price",
            "category",
            "image_url",
            "stock",
            "is_sold",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "seller",
            "is_sold",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "title": {"required": True, "allow_blank": False},
            "description": {"required": True, "allow_blank": False},
            "category": {"required": True, "allow_blank": False},
        }

    def validate_title(self, value):
        title = value.strip()

        if len(title) < 3:
            raise serializers.ValidationError(
                "Title must be at least 3 characters long."
            )
            
            
        if not re.match(r"^[a-zA-Z]", title):
            raise serializers.ValidationError(
                "Title must start with a letter."
            )

        return title

    def validate_description(self, value):
        description = value.strip()

        if len(description) < 10:
            raise serializers.ValidationError(
                "Description must be at least 10 characters long."
            )


        if not re.match(r"^[a-zA-Z]", description):
            raise serializers.ValidationError(
                "Description must start with a letter."
            )

        return description

    def validate_category(self, value):
        category = value.strip()

        if len(category) < 2:
            raise serializers.ValidationError(
                "Category must be at least 2 characters long."
            )

        if not re.match(r"^[a-zA-Z]", category):
            raise serializers.ValidationError(
                "Category must start with a letter."
            )

        return category

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value

    def validate_stock(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Stock must be at least 1."
            )

        return value
