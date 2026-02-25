from django.contrib import admin

from .models import Order, OrderItem
from analytics.utils import log_admin_action


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "full_name", "phone", "total_price", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("full_name", "phone", "email")
    inlines = [OrderItemInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        action = "UPDATE_ORDER" if change else "CREATE_ORDER"
        log_admin_action(
            request.user,
            action,
            {"id": obj.id, "status": obj.status, "total_price": str(obj.total_price)},
        )

    def delete_model(self, request, obj):
        payload = {
            "id": obj.id,
            "status": obj.status,
            "total_price": str(obj.total_price),
        }
        super().delete_model(request, obj)
        log_admin_action(request.user, "DELETE_ORDER", payload)
