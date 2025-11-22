# HRMS Backend (Express + Sequelize + SQLite)

## Quick start

- cd backend
- npm install
- npm run migrate      # run SQL migrations (idempotent)
- npm run seed         # create demo org, admin and sample employees/teams
- npm run dev

Server runs on PORT (default 5000).
SQLite file will be created at DATABASE_STORAGE path (default ./database.sqlite).

Endpoints:
- POST /api/auth/register  { orgName, adminName, email, password }
- POST /api/auth/login     { email, password }
- POST /api/auth/logout
- CRUD employees /api/employees (protected)
- CRUD teams /api/teams (protected)
- POST /api/teams/:teamId/assign  { employeeIds: [1,2] } (protected)
- POST /api/teams/:teamId/unassign { employeeIds: [...] } (protected)
- GET /api/logs (protected)
