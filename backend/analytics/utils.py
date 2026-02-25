from typing import Any, Dict

from django.contrib.auth import get_user_model

from .models import AdminLog


User = get_user_model()


def log_admin_action(admin_user: User | None, action: str, payload: Dict[str, Any] | None = None) -> None:
    AdminLog.objects.create(admin_user=admin_user, action=action, payload=payload or {})

