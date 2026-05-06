IPB Campus Facility & Queue System — Backend

This folder contains a FastAPI backend for a campus facility reservation system.

How to run (dev):

1. Copy `.env.example` to `.env` and edit `DATABASE_URL` if needed.
2. Add `FIREBASE_CREDENTIALS` and optionally `INITIAL_ADMIN_EMAILS` to `.env`.
3. Create a venv and install dependencies:

```bash
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```

4. Open http://127.0.0.1:8000 in your browser. API docs: http://127.0.0.1:8000/docs

Notes:
- Business logic lives in `src/domain` and `src/services`.
- Controllers in `src/api` only orchestrate and map DTOs to services.
- Authentication is handled by Firebase ID token verification in `src/middleware/firebase_auth.py`.
- Admin roles are stored in the database; `INITIAL_ADMIN_EMAILS` can promote users by email when they first log in.
- By default the app uses SQLite at `./dev.db`; set `DATABASE_URL` to a Postgres connection string for production.

Core API endpoints:
- `GET /facilities`
- `POST /facilities` (admin only)
- `PUT /facilities/{id}` (admin only)
- `DELETE /facilities/{id}` (admin only)
- `POST /reservations`
- `GET /reservations/me`
- `GET /reservations` (admin only)
- `PUT /reservations/{id}/status`
