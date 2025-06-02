# Twitter Monitoring Project

A full-stack application for monitoring Twitter profiles, tracking user activity, and alerting on inactivity. Built with NestJS (backend) and React + TypeScript (frontend).

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Backend](#backend)
  - [Endpoints](#backend-endpoints)
- [Frontend](#frontend)
- [Development & Testing](#development--testing)
- [Docker (Recommended)](#docker-recommended)

---

## Features

- Submit and track Twitter-like activities (Tweet, Retweet, Reply)
- View all monitored profiles with activity stats
- See alerts for inactive profiles
- Responsive, modern UI (Material-UI)
- Type-safe codebase (TypeScript)
- Unit tests for backend

---

## Architecture

- **Backend:** NestJS, TypeORM, PostgreSQL
- **Frontend:** React, Vite, TypeScript, Material-UI
- **Communication:** REST API (JSON)

---

## Backend

### Backend Endpoints

| Method | Endpoint    | Description                                                    |
| ------ | ----------- | -------------------------------------------------------------- |
| POST   | `/activity` | Submit a new activity                                          |
| GET    | `/profiles` | List all profiles with stats                                   |
| GET    | `/alerts`   | List inactive profiles (with optional `threshold` query param) |

#### Example Requests

- **Submit Activity:**
  ```bash
  curl -X POST http://localhost:3000/activity \
    -H 'Content-Type: application/json' \
    -d '{"handle": "elonmusk", "type": "TWEET"}'
  ```
- **Get Profiles:**
  ```bash
  curl http://localhost:3000/profiles
  ```
- **Get Inactive Alerts:**
  ```bash
  curl http://localhost:3000/alerts?threshold=30
  ```

---

## Frontend

- Submit activity via form
- View all profiles and their activity
- View inactive profiles (alerts)

---

## Docker (Recommended)

The easiest and recommended way to run the entire project (backend, frontend, and database) is with Docker Compose.

### 1. Build and start all services:

```bash
docker-compose up --build
```

- Backend: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:5173](http://localhost:5173)

> **Note:** All dependencies, environment variables, and database setup are handled automatically by Docker Compose.

---

## Development & Testing

- **Backend tests:**
  ```bash
  docker-compose exec backend npm run test
  ```
