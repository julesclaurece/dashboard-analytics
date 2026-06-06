# Dashboard Analytics

A full-stack analytics dashboard built with **FastAPI** and **React**. Displays real-time business metrics — revenue, orders, users — with interactive charts and period filters.

![Dashboard Preview](https://via.placeholder.com/900x500/080b12/6366f1?text=Dashboard+Analytics)

## Features

- **KPI Cards** — Revenue, Orders, Users, Avg Order Value with growth % vs previous period
- **Revenue Over Time** — Area chart filterable by 7d / 30d / 90d / 1y
- **Revenue by Category** — Bar chart (Electronics, Clothing, Books, Home, Sports)
- **Orders by Status** — Donut chart (completed / pending / cancelled)
- **Top Countries** — Horizontal bar ranking
- **Recent Orders** — Live table with status badges

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Recharts, Axios, Vite |
| Backend | FastAPI, SQLAlchemy, Uvicorn |
| Database | PostgreSQL |
| Deploy | Vercel (frontend) + Railway (backend + DB) |

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with your DATABASE_URL

python seed.py          # seed 500 orders + 15 users
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000` — Swagger docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env    # set VITE_API_URL=http://localhost:8000
npm run dev
```

App runs at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/metrics/kpis` | KPI summary with growth % |
| GET | `/api/metrics/revenue-over-time` | Daily revenue series |
| GET | `/api/metrics/orders-by-category` | Revenue per category |
| GET | `/api/metrics/orders-by-status` | Count per status |
| GET | `/api/metrics/top-countries` | Top 5 countries by revenue |
| GET | `/api/metrics/recent-orders` | Latest orders |

All endpoints accept `?period=7d|30d|90d|1y`.

## Deployment

### Railway (Backend)
1. Create a new Railway project
2. Add a PostgreSQL plugin — Railway sets `DATABASE_URL` automatically
3. Deploy the `backend/` folder
4. Set `CORS_ORIGINS` to your Vercel URL

### Vercel (Frontend)
1. Import the `frontend/` folder
2. Set `VITE_API_URL` to your Railway backend URL
3. Deploy
