# IPB Reserve — Sistem Peminjaman Fasilitas Kampus IPB

A web-based facility reservation system for IPB University that allows users to book and manage campus facilities through a modern, responsive interface.

## Tech Stack
- **Frontend:** React.js with Vite — handles component rendering and centralized API calls
- **Backend:** FastAPI (Python) — layered architecture with Routes, Services, and Repositories
- **Database:** PostgreSQL — relational database connected directly to the Repository layer

## Architecture
This project follows a Modern N-Tier Web Architecture:

- **Frontend (Client)** — React collects user input and displays results
- **Backend (Server)** — FastAPI organizes logic into three layers:
  - Routes — API endpoints
  - Services — business logic
  - Repositories — database access
- **Database** — PostgreSQL stores and manages all facility and booking data

Design principles used: **Repository Pattern** and **Dependency Injection** for modular, testable, and maintainable code.

## Features
- Browse and search available campus facilities
- Submit and manage facility reservation requests
- Admin management of facility availability

## How to Run

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev
