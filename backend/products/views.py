from django.db.models import Q
from rest_framework import viewsets, permissions

from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductSerializer, ReviewSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        category_slug = params.get("category")
        brand = params.get("brand")
        price_min = params.get("price_min")
        price_max = params.get("price_max")
        socket = params.get("socket")
        memory_type = params.get("memory_type")
        search = params.get("search")
        is_promo = params.get("is_promo")
        ordering = params.get("ordering")

        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        if brand:
            qs = qs.filter(brand__iexact=brand)
        if price_min:
            qs = qs.filter(price__gte=price_min)
        if price_max:
            qs = qs.filter(price__lte=price_max)
        if socket:
            qs = qs.filter(socket__iexact=socket)
        if memory_type:
            qs = qs.filter(memory_type__iexact=memory_type)
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(slug__icontains=search)
                | Q(brand__icontains=search)
            )
        if is_promo:
            qs = qs.filter(is_promo=is_promo.lower() == "true")

        if ordering in ["price", "-price", "created_at", "-created_at"]:
            qs = qs.order_by(ordering)

        return qs


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from django.shortcuts import render

# Create your views here.
