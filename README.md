# HRMS Full Project (Minimal but complete)

This archive contains a minimal full-stack HRMS assignment implementation:
- Backend: Node.js + Express + Sequelize using SQLite (for easy local setup).
- Frontend: React (Vite) simple SPA.

## Quick start (local)
1. Backend:
   - cd backend
   - npm install
   - npm run dev
   - Server runs at http://localhost:5000
2. Frontend:
   - cd frontend
   - npm install
   - npm run dev
   - Open http://localhost:5173 (or as Vite shows)

## Notes
- Authentication uses JWT; token stored in localStorage (for demo).
- Logs are stored in `logs` table (SQLite) and visible in Dashboard.
- Organisation isolation: each created organisation owns its employees/teams.
- For production, switch to Postgres/MySQL by updating Sequelize config in backend/src/models/index.js.

## What to improve (ideas for extra credit)
- Add migrations and seeders.
- Replace SQLite with Postgres and provide docker-compose.
- Add role-based permissions and better frontend UX.
- Use httpOnly cookies for JWT in production.


Added: Sequelize-style migrate/seed, role-based access control (admin/manager/staff), basic API tests (jest+supertest), frontend assignment modal with multi-select and framer-motion.
