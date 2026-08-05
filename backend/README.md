# Study Abroad Platform - Backend API

A production-ready Node.js, Express.js, and MongoDB backend for a Study Abroad Platform. Designed to power student registration, university & program discovery, profile-based recommendations, and application status workflows.

---

## 🌟 Key Features

- **Task 1: Secure Authentication & Profile Management**
  - User registration and login with `bcrypt` (10 salt rounds) password hashing.
  - Non-plaintext password storage (`select: false` on Mongoose model).
  - JWT token generation and verification middleware.
  - Student preference tracking (preferred country, field, budget, IELTS score, intake).

- **Task 2: University & Program Discovery Engine**
  - Multi-criteria filtering: `country`, `field`, `intake`, `maxFee` (budget), `minIelts`.
  - Flexible sorting: by fee (`asc`/`desc`), name, or ranking.
  - Page-based pagination: `page`, `limit`, returning `totalDocs`, `totalPages`, `currentPage`, `hasNextPage`, `hasPrevPage`.
  - Database projection to return only requested fields.

- **Task 3: MongoDB Aggregation Pipeline Recommendation Engine**
  - Matches student profile preferences (country, field, budget, IELTS score, intake).
  - Multi-stage MongoDB Aggregation Pipeline (`$lookup`, `$match`, `$addFields`, `$sort`, `$project`).
  - Weighted match score calculation (0–100) and suitability badges (`Excellent Match`, `Good Match`, `Moderate Match`).

- **Task 4: Application Status Workflow**
  - Submit applications to university programs.
  - **Duplicate Application Guard**: Enforces single application per program per student via database compound unique index (`{ student: 1, program: 1 }`).
  - Application status timeline history: `Applied` $\rightarrow$ `Reviewed` $\rightarrow$ `Accepted` / `Rejected` with notes and timestamps.

- **Task 5: Performance Optimization & Caching**
  - Redis caching layer (`ioredis`) for high-frequency GET queries with automatic fallback to `node-cache` when Redis is offline.
  - Compound MongoDB indexes on frequently queried fields (`{ country: 1, name: 1 }`, `{ field: 1, fee: 1, intake: 1 }`).

- **Task 6: Automated Testing Suite**
  - Comprehensive unit and integration tests using `Jest` and `Supertest`.
  - Tests covering Authentication, Discovery, Recommendation Engine, and Application Workflows.

- **Task 7: Containerization & Documentation**
  - `Dockerfile` and `docker-compose.yml` for Node, MongoDB, and Redis.

---

## 📁 Project Structure

```
backend/
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
├── README.md
├── server.js
├── scripts/
│   └── seedData.js
└── src/
    ├── app.js
    ├── config/
    │   ├── db.js
    │   ├── database.js
    │   └── redis.js
    ├── controllers/
    │   ├── applicationController.js
    │   ├── authController.js
    │   ├── recommendationController.js
    │   └── universityController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── cacheMiddleware.js
    │   ├── errorMiddleware.js
    │   └── rateLimiter.js
    ├── models/
    │   ├── Application.js
    │   ├── Program.js
    │   ├── University.js
    │   └── User.js
    ├── routes/
    │   ├── applicationRoutes.js
    │   ├── authRoutes.js
    │   ├── recommendationRoutes.js
    │   └── universityRoutes.js
    ├── services/
    │   └── recommendationService.js
    ├── tests/
    │   ├── application.test.js
    │   ├── auth.test.js
    │   ├── discovery.test.js
    │   └── recommendation.test.js
    ├── utils/
    │   ├── generateToken.js
    │   ├── jwt.js
    │   ├── pagination.js
    │   └── responseHandler.js
    └── validations/
        ├── authValidation.js
        ├── applicationValidation.js
        └── programValidation.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/study_abroad
JWT_SECRET=super_secret_jwt_key_study_abroad_2026
JWT_EXPIRES_IN=7d
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Populate realistic sample data (Universities in Canada, UK, USA, Australia, programs, and sample user Rahul):
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

### 4. Run Automated Test Suite
```bash
npm test
```

---

## 🐳 Running with Docker Compose

To launch the full stack (Node App + MongoDB + Redis):

```bash
docker-compose up --build
```

---

## 📖 API Endpoints & Payload Guide

### Authentication (`/api/auth`)

#### `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "password": "Rahul123Password",
    "preferredCountry": "Canada",
    "preferredField": "Computer Science",
    "budget": 30000,
    "ieltsScore": 7,
    "preferredIntake": "Fall"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "_id": "66b1...",
        "name": "Rahul",
        "email": "rahul@gmail.com",
        "role": "student",
        "preferredCountry": "Canada",
        "preferredField": "Computer Science",
        "budget": 30000,
        "ieltsScore": 7,
        "preferredIntake": "Fall"
      },
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

#### `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "rahul@gmail.com",
    "password": "Rahul123Password"
  }
  ```

#### `GET /api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`

---

### Discovery (`/api/programs` & `/api/universities`)

#### `GET /api/programs`
- **Query Parameters:**
  - `country` (e.g. `Canada`)
  - `field` (e.g. `Computer Science`)
  - `maxFee` (e.g. `30000`)
  - `minIelts` (e.g. `7`)
  - `sortBy` (`fee`, `title`, `createdAt`)
  - `order` (`asc`, `desc`)
  - `page` (default `1`)
  - `limit` (default `10`)
- **Example Request:**
  `GET /api/programs?country=Canada&field=Computer%20Science&maxFee=30000&sortBy=fee&order=asc&page=1&limit=10`

---

### Recommendation Engine (`/api/recommendations`)

#### `GET /api/recommendations`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Runs a MongoDB Aggregation Pipeline matching the logged-in student's saved preferences against programs.

#### `POST /api/recommendations/custom`
- **Request Body:**
  ```json
  {
    "country": "Canada",
    "field": "Computer Science",
    "budget": 30000,
    "ieltsScore": 7,
    "intake": "Fall"
  }
  ```

---

### Application Workflow (`/api/applications`)

#### `POST /api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "programId": "66b1...",
    "statementOfPurpose": "I want to specialize in AI and distributed systems."
  }
  ```

#### `GET /api/applications`
- **Headers:** `Authorization: Bearer <token>`

#### `PATCH /api/applications/:id/status`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "status": "Reviewed",
    "note": "Documents verified by counselor"
  }
  ```
  *(Status transition options: `Applied` $\rightarrow$ `Reviewed` $\rightarrow$ `Accepted` / `Rejected`)*

---

## 🛠️ Architecture Decisions

1. **Password Security**: Used `bcrypt` with 10 salt rounds. User passwords have `select: false` on the schema to prevent accidental leaks in DB queries.
2. **Duplicate Application Prevention**: Enforced at database schema level using Mongoose compound unique index `{ student: 1, program: 1 }` and handled gracefully in controllers.
3. **Resilient Redis Caching**: Redis client automatically falls back to `node-cache` in environments where Redis server is not running, guaranteeing 100% uptime.
