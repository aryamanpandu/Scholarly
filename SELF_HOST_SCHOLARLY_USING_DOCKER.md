# Self-Hosting Scholarly with Docker

This guide explains how to run Scholarly locally or on your own server using **Docker Compose**. The application runs as three containers:

- **db**: MySQL 8 database
- **backend**: Node.js / Express API
- **frontend**: nginx, which serves the built React app and proxies API requests to the backend

```
Browser ──► frontend (nginx, port 80) ──┬── /, /home, *.js ...  → built React files
                                        └── /api/*              → backend:4000 ──► db:3306
```

Only port **80** is published. The backend and database are reachable only from inside the Docker network.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2 (included with Docker Desktop)
- A clone of this repository:
  ```bash
  git clone <your-repo-url>
  cd Scholarly
  ```

---

## Configuration

### Environment file

Create `server/.env`. Both the database and the backend containers read it.

```env
# MySQL container
MYSQL_ROOT_PASSWORD=yourpassword
MYSQL_DATABASE=Scholarly

# Backend connection
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=Scholarly
DB_HOST=db          # the Compose service name, not localhost
DB_PORT=3306

SESSION_SECRET=a-long-random-string
```

`server/.env` is passed in at runtime and is **not** copied into the images.

The frontend needs no configuration for Docker. Because nginx serves the app and proxies `/api`, the frontend calls the API on the same origin. `client/.env` (with `VITE_API_BASE_URL`) is only used for local development with `npm run dev` and is excluded from the Docker build.

### Database initialization

On first start, MySQL creates the schema from `server/scholarly_database.sql`. Data is stored in the named volume `db_data`, so it survives restarts and rebuilds.

The SQL script only runs when the volume is **empty**. If the first start failed partway and the tables are missing, reset the volume (this deletes all data):

```bash
docker compose down -v
```

---

## Running the application

From the project root:

```bash
docker compose up --build -d
```

- `--build` rebuilds the images. The backend compiles its TypeScript and the frontend runs the Vite build during this step.
- `-d` runs the containers in the background.

Startup order:
1. `flashcard-mysql`: waits until the healthcheck passes
2. `flashcard-server`: connects to MySQL (it retries if the database isn't ready yet)
3. `flashcard-client`: starts nginx on port 80

Then open **http://localhost** (or your server's IP or domain).

---

## Managing containers

| Task | Command |
| --- | --- |
| See status | `docker compose ps` |
| Follow backend logs | `docker compose logs -f backend` |
| Stop everything | `docker compose down` |
| Stop and delete the database | `docker compose down -v` |
| Apply code changes | `docker compose up --build -d` |

---

## How the images are built

- **Backend** (`server/Dockerfile`): installs dependencies with `npm ci`, compiles `src/` to `dist/` with `tsc`, and runs `node dist/app.js`. Local `node_modules`, `dist` and `.env` are excluded by `server/.dockerignore`.
- **Frontend** (`client/Dockerfile`): a two-stage build. A Node stage runs `npm run build`, then only the output (`dist/`) and `client/nginx.conf` are copied into a small `nginx:alpine` image.

### nginx (`client/nginx.conf`)

- Serves the React build and falls back to `index.html` for client-side routes like `/home`.
- Forwards everything under `/api/` to `http://backend:4000`, keeping the `/api` prefix.
- Caches hashed static assets (JS, CSS, images, fonts) for 6 months.
- Adds `X-Content-Type-Options` and `X-Frame-Options` security headers.

---

## Troubleshooting

- **Backend keeps restarting**: run `docker compose logs backend`. `ENOTFOUND db` or `ECONNREFUSED` means it can't reach MySQL. Check that `DB_HOST=db` and that the `db` container is healthy.
- **Login works but you're immediately logged out**: make sure you're using the app through nginx (port 80), not calling the backend directly.
- **Tables are missing**: the volume was created before the schema loaded. See [Database initialization](#database-initialization).
- **Port 80 already in use**: change the mapping in `docker-compose.yml`, for example `"8080:80"`, and open `http://localhost:8080`.
