from rest_framework import serializers


# Nobody buys 50 different things at once on this marketplace, and every
# listing only ever has one item, so these caps keep a hand written request
# from sending us a huge list to chew through.
MAX_ITEMS = 50
MAX_QUANTITY = 100


class CheckoutSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False,
        max_length=MAX_ITEMS,
        error_messages={
            "max_length": f"You cannot check out more than {MAX_ITEMS} items at once.",
        },
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

            if product_id < 1:
                raise serializers.ValidationError(
                    "product_id must be a positive number."
                )

            if product_id in used_product_ids:
                raise serializers.ValidationError(
                    "Each product may appear only once."
                )
            if quantity < 1:
                raise serializers.ValidationError(
                    "Quantity must be at least 1."
                )

            if quantity > MAX_QUANTITY:
                raise serializers.ValidationError(
                    f"Quantity cannot be more than {MAX_QUANTITY}."
                )

            used_product_ids.append(product_id)
            new_items.append({
                "product_id": product_id,
                "quantity": quantity,
            })

        return new_items
