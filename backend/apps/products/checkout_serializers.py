from rest_framework import serializers


class CheckoutSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False,
    )

    def validate_items(self, value):
        new_items = []
        used_product_ids = []

        for item in value:
            if "product_id" not in item or "quantity" not in item:
                raise serializers.ValidationError(
                    "Each item must contain product_id and quantity."
                )

            try:
                product_id = int(item["product_id"])
                quantity = int(item["quantity"])
            except (TypeError, ValueError):
                raise serializers.ValidationError(
                    "product_id and quantity must be integers."
                )

            if product_id in used_product_ids:
                raise serializers.ValidationError(
                    "Each product may appear only once."
                )
            if quantity < 1:
                raise serializers.ValidationError(
                    "Quantity must be at least 1."
                )

            used_product_ids.append(product_id)
            new_items.append({
                "product_id": product_id,
                "quantity": quantity,
            })

        return new_items
