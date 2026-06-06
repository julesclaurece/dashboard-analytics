from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routers import metrics, orders, products, customers
from .models import models  # noqa: F401 — ensures models are registered

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dashboard Analytics API", version="1.0.0")

origins = [o.strip() for o in settings.cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(metrics.router)
app.include_router(orders.router)
app.include_router(products.router)
app.include_router(customers.router)


@app.get("/")
def root():
    return {"message": "Dashboard Analytics API", "docs": "/docs"}
