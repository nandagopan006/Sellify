import re
from rest_framework import serializers

from .models import Product


# TextField has no length limit of its own, so we pick one. Raise this number
# if sellers ever need longer descriptions.
MAX_DESCRIPTION_LENGTH = 5000


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
            "price": {"required": True},
            "category": {"required": True, "allow_blank": False},
            # The model says blank=True, so without this the API happily
            # created products with no picture at all.
            "image_url": {"required": True, "allow_blank": False},
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


        if len(description) > MAX_DESCRIPTION_LENGTH:
            raise serializers.ValidationError(
                f"Description cannot be longer than {MAX_DESCRIPTION_LENGTH} characters."
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

    def validate_image_url(self, value):
        url = value.strip()

        # URLField already rejects things like "javascript:alert(1)", but it
        # also allows ftp:// and similar, which a browser <img> cannot show.
        if not url.startswith("http://") and not url.startswith("https://"):
            raise serializers.ValidationError(
                "Image URL must start with http:// or https://."
            )

        return url

    def validate_stock(self, value):
        if value != 1:
            raise serializers.ValidationError(
                "Stock must be exactly 1 because each listing represents one item."
            )

        return value
