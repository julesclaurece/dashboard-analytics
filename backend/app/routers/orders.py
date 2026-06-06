from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from ..database import get_db
from ..models.models import Order, OrderStatus

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("")
def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(12, le=50),
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Order)
    if status and status in [s.value for s in OrderStatus]:
        q = q.filter(Order.status == status)
    if search:
        term = f"%{search}%"
        q = q.filter(
            Order.customer_name.ilike(term) | Order.product.ilike(term)
        )
    total = q.count()
    rows = q.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "items": [
            {
                "id": o.id,
                "customer": o.customer_name,
                "product": o.product,
                "category": o.category,
                "amount": o.amount,
                "status": o.status,
                "country": o.country,
                "date": o.created_at.strftime("%Y-%m-%d"),
            }
            for o in rows
        ],
    }
