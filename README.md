# Simple Q&A Forum API

RESTful API untuk aplikasi Q&A Forum sederhana. Pengguna dapat mendaftar, login, membuat thread pertanyaan, serta melakukan CRUD pada thread yang mereka buat.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS 11
- **ORM:** Prisma 7 (Driver Adapter dengan `pg` pool)
- **Database:** PostgreSQL
- **Authentication:** Passport JWT + bcrypt password hashing
- **API Docs:** Swagger UI (`/api/docs`)
- **Validation:** class-validator + class-transformer

## Project Structure

```
src/
├── auth/                  # Modul autentikasi
│   ├── dto/               # RegisterDto, LoginDto
│   ├── entities/
│   ├── guards/            # JwtAuthGuard
│   ├── strategies/        # JwtStrategy (Passport)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                 # Modul user management
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   └── users.module.ts
├── threads/               # Modul thread CRUD
│   ├── dto/               # CreateThreadDto, UpdateThreadDto
│   ├── entities/
│   ├── threads.controller.ts
│   ├── threads.service.ts
│   ├── threads.repository.ts
│   └── threads.module.ts
├── prisma/                # PrismaService (global)
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── common/
│   ├── decorators/        # @GetUser() custom decorator
│   └── filters/           # AllExceptionsFilter (global)
├── app.module.ts
└── main.ts
```

## Database Schema

### `users` Table

| Column        | Type           | Constraints      |
| ------------- | -------------- | ---------------- |
| id            | VARCHAR (cuid) | PRIMARY KEY      |
| username      | VARCHAR        | UNIQUE, NOT NULL |
| email         | VARCHAR        | UNIQUE, NOT NULL |
| password_hash | VARCHAR        | NOT NULL         |
| created_at    | TIMESTAMP      | DEFAULT NOW()    |

### `threads` Table

| Column     | Type           | Constraints                               |
| ---------- | -------------- | ----------------------------------------- |
| id         | VARCHAR (cuid) | PRIMARY KEY                               |
| user_id    | VARCHAR        | FOREIGN KEY → users.id, ON DELETE CASCADE |
| title      | VARCHAR        | NOT NULL                                  |
| content    | TEXT           | NOT NULL                                  |
| created_at | TIMESTAMP      | DEFAULT NOW()                             |
| updated_at | TIMESTAMP      | AUTO-UPDATE                               |

**Relasi:** Satu user dapat memiliki banyak thread (one-to-many).

### Entity Relationship Diagram

```mermaid
erDiagram
    users {
        varchar id PK "cuid"
        varchar username UK "unique"
        varchar email UK "unique"
        varchar password_hash "hashed"
        timestamp created_at "default now()"
    }

    threads {
        varchar id PK "cuid"
        varchar user_id FK "references users.id"
        varchar title
        text content
        timestamp created_at "default now()"
        timestamp updated_at "auto update"
    }

    users ||--o{ threads : "creates"
```

## API Endpoints

### Auth

| Method | Endpoint             | Description                  | Auth |
| ------ | -------------------- | ---------------------------- | ---- |
| POST   | `/api/auth/register` | Register user baru           | No   |
| POST   | `/api/auth/login`    | Login dan dapatkan JWT token | No   |

### Users

| Method | Endpoint         | Description              | Auth |
| ------ | ---------------- | ------------------------ | ---- |
| GET    | `/api/users/:id` | Lihat profil public user | No   |

### Threads

| Method | Endpoint                  | Description                       | Auth |
| ------ | ------------------------- | --------------------------------- | ---- |
| POST   | `/api/threads`            | Buat thread baru                  | Yes  |
| GET    | `/api/threads`            | List semua thread                 | No   |
| GET    | `/api/threads/my-threads` | List thread milik user yang login | Yes  |
| GET    | `/api/threads/:id`        | Detail thread by ID               | No   |
| PUT    | `/api/threads/:id`        | Update thread (hanya pemilik)     | Yes  |
| DELETE | `/api/threads/:id`        | Hapus thread (hanya pemilik)      | Yes  |

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- pnpm

### 1. Clone Repository

```bash
git clone <repository-url>
cd code-challenge-milestone-2
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi lokal:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/qna_forum?schema=public"
JWT_SECRET="change-this-to-a-long-random-string"
JWT_EXPIRES_IN="1d"
```

### 4. Setup Database

Buat database PostgreSQL, lalu jalankan Prisma migration:

```bash
npx prisma migrate dev
```

Seed data dummy (opsional):

```bash
npx prisma db seed
```

### 5. Run the Server

```bash
# development (watch mode)
pnpm run start:dev

# production
pnpm run start:prod
```

Server berjalan di `http://localhost:{PORT}`. Swagger UI tersedia di `http://localhost:{PORT}/api/docs`.

## Validation Rules

### Register

| Field    | Rules                                              |
| -------- | -------------------------------------------------- |
| username | string, 3-30 chars, alphanumeric + underscore only |
| email    | valid email format                                 |
| password | string, min 6 chars                                |

### Login

| Field    | Rules              |
| -------- | ------------------ |
| email    | valid email format |
| password | string, not empty  |

### Create Thread

| Field   | Rules                |
| ------- | -------------------- |
| title   | string, 5-200 chars  |
| content | string, min 10 chars |

### Update Thread

Semua field bersifat optional (`PartialType` dari CreateThreadDto).

## Error Responses

API mengembalikan response JSON terstruktur:

```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request",
  "path": "/api/auth/register",
  "timestamp": "2026-08-25T00:00:00.000Z"
}
```

| Status Code | Keterangan                               |
| ----------- | ---------------------------------------- |
| 400         | Validasi gagal / data duplikat           |
| 401         | Tidak terautentikasi / token invalid     |
| 403         | Tidak punya akses (bukan pemilik thread) |
| 404         | Resource tidak ditemukan                 |
| 500         | Server error                             |

## Available Scripts

```bash
pnpm run start          # Start server
pnpm run start:dev      # Start with watch mode
pnpm run start:debug    # Start with debug mode
pnpm run start:prod     # Production build
pnpm run build          # Build the project
pnpm run test           # Unit tests
pnpm run test:e2e       # E2E tests
pnpm run test:cov       # Test coverage
pnpm run lint           # Lint & auto-fix
pnpm run format         # Format code with Prettier
```

## API Documentation Screenshots

### Swagger

<!-- Screenshot: Swagger -->

![Swagger](./screenshots/code-challenge-milestone-2.png)
