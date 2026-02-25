from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class AdminLog(models.Model):
    admin_user = models.ForeignKey(
        User,
        related_name="admin_logs",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    action = models.CharField(max_length=255)
    payload = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.action} at {self.created_at}"
