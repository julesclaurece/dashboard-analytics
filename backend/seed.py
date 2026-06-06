import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

from app.database import SessionLocal, engine
from app.models.models import Base, Order, User, OrderStatus

Base.metadata.create_all(bind=engine)

CUSTOMERS = [
    "Alice Martin", "Bob Johnson", "Clara Lee", "David Chen", "Emma Wilson",
    "Frank Garcia", "Grace Kim", "Henry Brown", "Isla Davis", "Jack Taylor",
    "Karen White", "Liam Scott", "Mia Anderson", "Noah Thomas", "Olivia Jackson",
]

PRODUCTS = {
    "Electronics": ["Laptop Pro", "Wireless Earbuds", "Smart Watch", "Tablet X", "4K Monitor"],
    "Clothing": ["Slim Fit Jeans", "Leather Jacket", "Running Shoes", "Summer Dress", "Hoodie"],
    "Books": ["Clean Code", "Design Patterns", "The Pragmatic Programmer", "Atomic Habits", "Deep Work"],
    "Home": ["Coffee Maker", "Air Purifier", "Desk Lamp", "Yoga Mat", "Blender Pro"],
    "Sports": ["Tennis Racket", "Dumbbells Set", "Cycling Helmet", "Running Belt", "Jump Rope"],
}

COUNTRIES = ["United States", "France", "Germany", "United Kingdom", "Canada", "Spain", "Japan", "Brazil"]

STATUSES = [OrderStatus.completed, OrderStatus.completed, OrderStatus.completed, OrderStatus.pending, OrderStatus.cancelled]


def random_date(days_back=365):
    return datetime.utcnow() - timedelta(days=random.randint(0, days_back), hours=random.randint(0, 23))


def seed():
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(Order).delete()
        db.query(User).delete()
        db.commit()

        # Seed users
        emails = set()
        users = []
        for name in CUSTOMERS:
            email = f"{name.lower().replace(' ', '.')}@example.com"
            if email in emails:
                continue
            emails.add(email)
            user = User(
                name=name,
                email=email,
                country=random.choice(COUNTRIES),
                created_at=random_date(365),
            )
            users.append(user)
        db.add_all(users)
        db.commit()

        # Seed orders
        orders = []
        for _ in range(500):
            category = random.choice(list(PRODUCTS.keys()))
            product = random.choice(PRODUCTS[category])
            price_map = {
                "Electronics": (199, 1499),
                "Clothing": (29, 199),
                "Books": (9, 49),
                "Home": (39, 299),
                "Sports": (19, 199),
            }
            lo, hi = price_map[category]
            order = Order(
                customer_name=random.choice(CUSTOMERS),
                product=product,
                category=category,
                amount=round(random.uniform(lo, hi), 2),
                status=random.choice(STATUSES),
                country=random.choice(COUNTRIES),
                created_at=random_date(365),
            )
            orders.append(order)

        db.add_all(orders)
        db.commit()
        print(f"Seeded {len(users)} users and {len(orders)} orders.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
