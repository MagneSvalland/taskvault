# TaskVault

A fullstack task manager I built to get more experience with React, Spring Boot, and Docker working together. Users can register, log in, and manage their tasks, all secured with JWT authentication.

## Screenshots

### Login
<img width="750" height="575" alt="image" src="https://github.com/user-attachments/assets/50d3a05f-6e22-4812-ab94-3a4b6f0d0fe6" />

### Register
<img width="721" height="533" alt="image" src="https://github.com/user-attachments/assets/e76fa871-6ac1-4304-b215-b04970169199" />

### All tasks
<img width="768" height="453" alt="image" src="https://github.com/user-attachments/assets/251be995-ec21-4fca-a002-3944c5ea3336" />

### Marking a task as done
<img width="744" height="459" alt="image" src="https://github.com/user-attachments/assets/f4ca0572-0943-4179-943f-aa22fc55a8bd" />

### Active tasks
<img width="779" height="471" alt="image" src="https://github.com/user-attachments/assets/0803e9bf-b996-4191-b533-30fbb9201112" />

### Completed tasks
<img width="767" height="425" alt="image" src="https://github.com/user-attachments/assets/40355959-db50-4f7e-b6a8-b944959d81be" />

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 + TypeScript |
| Backend | Java Spring Boot 3 + Spring Security |
| Database | PostgreSQL 16 |
| Auth | JWT + BCrypt |
| Charts | Recharts |
| DevOps | Docker + Docker Compose + GitHub Actions |

## Features

- Register and log in with JWT authentication
- Passwords hashed with BCrypt
- Add tasks with priority levels — low, medium, or high
- Set due dates with smart countdowns — shows "today", "2d left", or "⚠ 3d overdue"
- Live search — filter tasks by title instantly
- Mark tasks as done and filter by active / completed
- Analytics dashboard — visual breakdown of tasks by priority and completion rate
- Dark / light mode toggle with preference saved across sessions
- Each user only sees their own tasks
- Role-based access control (USER / ADMIN)
- CI/CD pipeline with GitHub Actions — automated lint, test, and Docker build on every push

## Running locally

You need Docker Desktop installed. Then just run:
```bash
docker-compose up --build
```

Start the frontend in a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register an account.
