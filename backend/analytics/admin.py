from django.contrib import admin

from .models import AdminLog


@admin.register(AdminLog)
class AdminLogAdmin(admin.ModelAdmin):
    list_display = ("admin_user", "action", "created_at")
    list_filter = ("action", "created_at")
