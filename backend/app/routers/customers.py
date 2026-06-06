from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from ..database import get_db
from ..models.models import User, Order, OrderStatus

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("")
def list_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(12, le=50),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    subq = (
        db.query(
            Order.customer_name,
            func.count(Order.id).label("total_orders"),
            func.sum(Order.amount).label("total_spent"),
        )
        .group_by(Order.customer_name)
        .subquery()
    )

    q = db.query(User, subq.c.total_orders, subq.c.total_spent).outerjoin(
        subq, User.name == subq.c.customer_name
    )

    if search:
        term = f"%{search}%"
        q = q.filter(User.name.ilike(term) | User.email.ilike(term))

    total = q.count()
    rows = q.order_by(func.coalesce(subq.c.total_spent, 0).desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "items": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "country": user.country,
                "total_orders": total_orders or 0,
                "total_spent": round(total_spent or 0, 2),
                "joined": user.created_at.strftime("%Y-%m-%d"),
            }
            for user, total_orders, total_spent in rows
        ],
    }
