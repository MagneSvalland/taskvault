# TaskVault

A fullstack task manager I built to get more experience with React, Spring Boot, and Docker working together. Users can register, log in, and manage their tasks, all secured with JWT authentication.

## Screenshots

### Login
<img width="750" height="575" alt="image" src="https://github.com/user-attachments/assets/50d3a05f-6e22-4812-ab94-3a4b6f0d0fe6" />

### Register
<img width="721" height="533" alt="image" src="https://github.com/user-attachments/assets/e76fa871-6ac1-4304-b215-b04970169199" />

### All tasks
<img width="864" height="591" alt="image" src="https://github.com/user-attachments/assets/9a319877-8770-45aa-a0c4-04f15bf2ebb4" />

### Marking a task as done
<img width="779" height="603" alt="image" src="https://github.com/user-attachments/assets/7aa0dc0f-25e9-40d4-8389-2766225c7581" />

### Active tasks
<img width="775" height="561" alt="image" src="https://github.com/user-attachments/assets/7432014d-24cf-4239-8e23-880409d4db48" />

### Completed tasks
<img width="763" height="501" alt="image" src="https://github.com/user-attachments/assets/23ad6559-b324-4ea3-ae94-10a68f694415" />

### Light mode
<img width="763" height="607" alt="image" src="https://github.com/user-attachments/assets/19f4fff1-40ec-4a59-8fa7-619e7636f44b" />

### Analytics
<img width="765" height="717" alt="image" src="https://github.com/user-attachments/assets/d6043877-6d34-4f68-b222-b6c05d4ef22d" />


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
