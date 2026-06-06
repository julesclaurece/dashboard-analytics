from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import Optional
from ..database import get_db
from ..models.models import Order, User, OrderStatus

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


def get_date_range(period: str):
    now = datetime.utcnow()
    if period == "7d":
        return now - timedelta(days=7), now
    elif period == "30d":
        return now - timedelta(days=30), now
    elif period == "90d":
        return now - timedelta(days=90), now
    elif period == "1y":
        return now - timedelta(days=365), now
    return now - timedelta(days=30), now


@router.get("/kpis")
def get_kpis(period: str = Query("30d"), db: Session = Depends(get_db)):
    start, end = get_date_range(period)

    total_revenue = db.query(func.sum(Order.amount)).filter(
        Order.status == OrderStatus.completed,
        Order.created_at >= start,
        Order.created_at <= end,
    ).scalar() or 0

    total_orders = db.query(func.count(Order.id)).filter(
        Order.created_at >= start,
        Order.created_at <= end,
    ).scalar() or 0

    new_users = db.query(func.count(User.id)).filter(
        User.created_at >= start,
        User.created_at <= end,
    ).scalar() or 0

    avg_order_value = (total_revenue / total_orders) if total_orders > 0 else 0

    # Previous period for growth
    prev_start = start - (end - start)
    prev_revenue = db.query(func.sum(Order.amount)).filter(
        Order.status == OrderStatus.completed,
        Order.created_at >= prev_start,
        Order.created_at < start,
    ).scalar() or 0

    prev_orders = db.query(func.count(Order.id)).filter(
        Order.created_at >= prev_start,
        Order.created_at < start,
    ).scalar() or 0

    prev_users = db.query(func.count(User.id)).filter(
        User.created_at >= prev_start,
        User.created_at < start,
    ).scalar() or 0

    def growth(current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return round(((current - previous) / previous) * 100, 1)

    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "new_users": new_users,
        "avg_order_value": round(avg_order_value, 2),
        "revenue_growth": growth(total_revenue, prev_revenue),
        "orders_growth": growth(total_orders, prev_orders),
        "users_growth": growth(new_users, prev_users),
    }


@router.get("/revenue-over-time")
def get_revenue_over_time(period: str = Query("30d"), db: Session = Depends(get_db)):
    start, end = get_date_range(period)

    rows = (
        db.query(
            func.date_trunc("day", Order.created_at).label("day"),
            func.sum(Order.amount).label("revenue"),
            func.count(Order.id).label("orders"),
        )
        .filter(
            Order.status == OrderStatus.completed,
            Order.created_at >= start,
            Order.created_at <= end,
        )
        .group_by("day")
        .order_by("day")
        .all()
    )

    return [
        {
            "date": row.day.strftime("%Y-%m-%d"),
            "revenue": round(row.revenue, 2),
            "orders": row.orders,
        }
        for row in rows
    ]


@router.get("/orders-by-category")
def get_orders_by_category(period: str = Query("30d"), db: Session = Depends(get_db)):
    start, end = get_date_range(period)

    rows = (
        db.query(Order.category, func.sum(Order.amount).label("revenue"), func.count(Order.id).label("count"))
        .filter(Order.created_at >= start, Order.created_at <= end)
        .group_by(Order.category)
        .order_by(func.sum(Order.amount).desc())
        .all()
    )

    return [{"category": row.category, "revenue": round(row.revenue, 2), "count": row.count} for row in rows]


@router.get("/orders-by-status")
def get_orders_by_status(period: str = Query("30d"), db: Session = Depends(get_db)):
    start, end = get_date_range(period)

    rows = (
        db.query(Order.status, func.count(Order.id).label("count"))
        .filter(Order.created_at >= start, Order.created_at <= end)
        .group_by(Order.status)
        .all()
    )

    return [{"status": row.status, "count": row.count} for row in rows]


@router.get("/top-countries")
def get_top_countries(period: str = Query("30d"), db: Session = Depends(get_db)):
    start, end = get_date_range(period)

    rows = (
        db.query(Order.country, func.sum(Order.amount).label("revenue"), func.count(Order.id).label("orders"))
        .filter(Order.created_at >= start, Order.created_at <= end)
        .group_by(Order.country)
        .order_by(func.sum(Order.amount).desc())
        .limit(5)
        .all()
    )

    return [{"country": row.country, "revenue": round(row.revenue, 2), "orders": row.orders} for row in rows]


@router.get("/recent-orders")
def get_recent_orders(limit: int = Query(10, le=50), db: Session = Depends(get_db)):
    rows = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": row.id,
            "customer": row.customer_name,
            "product": row.product,
            "category": row.category,
            "amount": row.amount,
            "status": row.status,
            "country": row.country,
            "date": row.created_at.strftime("%Y-%m-%d"),
        }
        for row in rows
    ]
