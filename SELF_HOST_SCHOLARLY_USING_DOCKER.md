# Self-Hosting Flashcard App with Docker

This guide explains how to set up and run the Flashcard App locally or on your own server using **Docker Compose**. The application consists of three services:

- **Database (MySQL 8)**
- **Backend (Node.js / Express server)**
- **Frontend (React / Next.js client)**

---

## Prerequisites

Before starting, make sure you have:

- [Docker](https://docs.docker.com/get-docker/) installed  
- [Docker Compose](https://docs.docker.com/compose/install/) installed  
- A clone of this repository:
  ```bash
  git clone <your-repo-url>
  cd <your-project-folder>
  ```

---

## Configuration

### 1. Environment Files
Each service has its own `.env` file for configuration.

- **Database & Backend**: `server/.env`  
  Example values:
  ```env
  MYSQL_ROOT_PASSWORD=yourpassword
  MYSQL_DATABASE=scholarly_db
  MYSQL_USER=scholarly_user
  MYSQL_PASSWORD=yourpassword

  PORT=4000
  ```

- **Frontend**: `client/.env`  
  Example values:
  ```env
  VITE_API_BASE_URL=http://localhost:4000
  ```

Make sure these files exist before running Docker.

---

### 2. Database Initialization
On the first run, MySQL will automatically initialize the schema using:

```
server/scholarly_database.sql
```

The database files are persisted in a named Docker volume called `db_data`.

---

## Running the Application

From the project root, run:

```bash
docker-compose up --build
```

- `--build` ensures the frontend and backend images are rebuilt.
- Containers will start in the following order:
  1. **MySQL database** (`flashcard-mysql`)
  2. **Backend API** (`flashcard-server`)
  3. **Frontend client** (`flashcard-client`)

---

## Accessing the App

- **Frontend**: [http://localhost:3000](http://localhost:3000)  
- **Backend API**: [http://localhost:4000](http://localhost:4000)  
- **Database (MySQL)**: accessible on port `3306`

---

## Managing Containers

- Start in detached mode:
  ```bash
  docker-compose up -d
  ```
- Stop services:
  ```bash
  docker-compose down
  ```
- Stop and remove volumes (e.g., reset database):
  ```bash
  docker-compose down -v
  ```

---

## Healthchecks

The database service includes a healthcheck to ensure MySQL is ready before the backend connects:

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  timeout: 20s
  retries: 10
```

---

## Notes

- If you change code in the backend or frontend, you may need to rebuild:
  ```bash
  docker-compose up --build
  ```
- For development, you can uncomment the `volumes` and `command` section in the backend service to enable hot-reloading with `npm start`.
