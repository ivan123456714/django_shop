from rest_framework import serializers

from products.models import Product
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "price", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "total_price",
            "full_name",
            "phone",
            "email",
            "address",
            "city",
            "payment_method",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "total_price", "created_at", "updated_at", "user"]

    def create(self, validated_data):
        """
        Create order, decrement product stock and calculate total price.
        """
        request = self.context.get("request")
        items_data = validated_data.pop("items", [])

        if request and request.user.is_authenticated:
            validated_data["user"] = request.user

        order = Order.objects.create(**validated_data)

        total = 0
        for item in items_data:
            product = item["product"]
            quantity = item["quantity"]

            if product.stock < quantity:
                raise serializers.ValidationError(
                    {"detail": f"Not enough stock for {product.name}. Available: {product.stock}"}
                )

            product.stock -= quantity
            product.save(update_fields=["stock"])

            price = product.price
            OrderItem.objects.create(
                order=order,
                product=product,
                price=price,
                quantity=quantity,
            )
            total += price * quantity

        order.total_price = total
        order.save(update_fields=["total_price"])

        return order

