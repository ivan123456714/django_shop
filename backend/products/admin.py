from django.contrib import admin

from .models import Category, Product, ProductImage, Review
from analytics.utils import log_admin_action


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent")
    prepopulated_fields = {"slug": ("name",)}

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        action = "UPDATE_CATEGORY" if change else "CREATE_CATEGORY"
        log_admin_action(
            request.user,
            action,
            {"id": obj.id, "name": obj.name, "slug": obj.slug},
        )

    def delete_model(self, request, obj):
        payload = {"id": obj.id, "name": obj.name, "slug": obj.slug}
        super().delete_model(request, obj)
        log_admin_action(request.user, "DELETE_CATEGORY", payload)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "brand", "price", "stock", "is_promo", "is_active")
    list_filter = ("category", "brand", "is_promo", "is_active")
    search_fields = ("name", "brand", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        action = "UPDATE_PRODUCT" if change else "CREATE_PRODUCT"
        log_admin_action(
            request.user,
            action,
            {"id": obj.id, "name": obj.name, "price": str(obj.price), "stock": obj.stock},
        )

    def delete_model(self, request, obj):
        payload = {"id": obj.id, "name": obj.name, "price": str(obj.price), "stock": obj.stock}
        super().delete_model(request, obj)
        log_admin_action(request.user, "DELETE_PRODUCT", payload)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
