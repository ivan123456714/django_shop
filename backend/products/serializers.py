from rest_framework import serializers

from .models import Category, Product, ProductImage, Review


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_main"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent"]


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "product", "user", "user_name", "rating", "comment", "created_at"]
        read_only_fields = ["user", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "brand",
            "price",
            "old_price",
            "stock",
            "is_active",
            "is_promo",
            "socket",
            "frequency",
            "memory_type",
            "specs",
            "category",
            "category_id",
            "images",
            "reviews",
            "created_at",
            "updated_at",
        ]

