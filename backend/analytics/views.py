from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from orders.models import Order, OrderItem


class SalesAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        qs = Order.objects.all()
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)

        total_orders = qs.count()
        total_revenue = qs.aggregate(total=Sum("total_price"))["total"] or 0

        top_categories = (
            OrderItem.objects.filter(order__in=qs)
            .values("product__category__name")
            .annotate(total_quantity=Sum("quantity"))
            .order_by("-total_quantity")[:5]
        )

        return Response(
            {
                "total_orders": total_orders,
                "total_revenue": total_revenue,
                "top_categories": list(top_categories),
            }
        )

from django.shortcuts import render

# Create your views here.
