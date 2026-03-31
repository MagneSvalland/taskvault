# TaskVault

A fullstack task management application with JWT authentication, real-time filtering, productivity analytics, and dark/light mode support.

## Features

- **Authentication** — JWT-based login and registration with secure token storage
- **Task management** — Create, complete, and delete tasks with priority levels (Low, Medium, High) and due dates
- **Smart due dates** — Countdowns shown as "today", "2d left", or "⚠ 3d overdue" instead of raw dates
- **Search & filter** — Live search by title, filter by status (All / Active / Completed)
- **Analytics dashboard** — Visual breakdown of tasks by priority (bar chart) and completion rate (donut chart)
- **Dark / light mode** — Toggle with preference saved to localStorage
- **CI/CD** — Automated lint and build pipeline via GitHub Actions on every push

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Backend | Spring Boot 3, Java 21 |
| Database | PostgreSQL 16 |
| Auth | JWT (jjwt) |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Getting Started

**With Docker (recommended):**
```bash
docker-compose up --build
cd frontend && npm run dev
```

**Manually:**
```bash
# Backend (requires PostgreSQL running locally)
cd backend && ./mvnw spring-boot:run

# Frontend
cd frontend && npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
