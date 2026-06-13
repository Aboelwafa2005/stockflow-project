# StockFlow

StockFlow is a professional MERN stack Inventory / Warehouse Management System built for a CV portfolio.

## Features
- JWT authentication with role-based access
- Admin, manager, and staff roles
- Product, category, supplier, warehouse, and stock movement management
- Low-stock alerts and reports
- Search, filter, sort, and pagination
- Image uploads
- Clean modular backend and reusable React frontend components

## Project Structure
- `backend/` Express + MongoDB API
- `frontend/` React + Vite UI

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Default Admin
- Email: `admin@stockflow.com`
- Password: `Admin123!`

## Main API Base
- `http://localhost:5000/api`

## Notes
- Product images are stored locally in `backend/uploads`
- The frontend expects the backend API URL from `VITE_API_URL`
