from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.models import Order

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("")
def list_products(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Order.product,
            Order.category,
            func.count(Order.id).label("sales"),
            func.sum(Order.amount).label("revenue"),
            func.avg(Order.amount).label("avg_price"),
        )
        .group_by(Order.product, Order.category)
        .order_by(func.sum(Order.amount).desc())
        .all()
    )

    return [
        {
            "name": r.product,
            "category": r.category,
            "sales": r.sales,
            "revenue": round(r.revenue, 2),
            "avg_price": round(r.avg_price, 2),
        }
        for r in rows
    ]
