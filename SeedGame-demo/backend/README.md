# SeedGame — Backend API

> RESTful backend cho nền tảng học lập trình & thi đấu trực tuyến **SeedGame**, xây dựng bằng **Node.js + Express** với kiến trúc phân lớp rõ ràng.

---

## 📑 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tech Stack](#tech-stack)
- [Kiến trúc thư mục](#kiến-trúc-thư-mục)
- [Tính năng chính](#tính-năng-chính)
- [API Endpoints](#api-endpoints)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt & chạy local](#cài-đặt--chạy-local)
- [Biến môi trường](#biến-môi-trường)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [Ghi dự án vào CV (Backend Intern)](#ghi-dự-án-vào-cv-backend-intern)

---

## Giới thiệu

**SeedGame** là nền tảng backend phục vụ:

- Xác thực người dùng (đăng ký / đăng nhập / đăng xuất / đổi mật khẩu).
- Quản lý bài tập lập trình (problems) — duyệt danh sách, xem chi tiết, nộp bài (submit).
- Quản lý khóa học (courses) cùng các module bài học.
- Quản lý cuộc thi (contests) — tạo, cập nhật, xóa, bảng xếp hạng và đăng ký tham gia.

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Runtime | Node.js ≥ 18 (ESM) |
| Web framework | Express 5.x |
| Database | PostgreSQL (`pg` driver — raw SQL) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Validation | Joi |
| Token blocklist | `node-cache` (in-memory) |
| Dev server | Nodemon |
| Env config | dotenv |

---

## Kiến trúc thư mục

```
backend/
├── src/
│   ├── server.js              # Entry point — khởi động Express
│   ├── configs/
│   │   └── postgres.js        # Khởi tạo pool kết nối PostgreSQL
│   ├── routers/
│   │   ├── index.js           # Gắn tất cả route vào app
│   │   ├── auth.route.js
│   │   ├── problems.route.js
│   │   ├── courses.route.js
│   │   └── contests.route.js
│   └── app/
│       ├── controllers/       # Nhận request, trả response
│       │   ├── auth.controller.js
│       │   ├── problems.controller.js
│       │   ├── courses.controller.js
│       │   └── contests.controller.js
│       ├── services/          # Business logic & truy vấn DB
│       │   ├── auth.service.js
│       │   ├── user.service.js
│       │   ├── problems.service.js
│       │   ├── courses.service.js
│       │   └── contests.service.js
│       ├── middleware/
│       │   └── common/
│       │       ├── require-authentication.js  # Kiểm tra JWT Bearer token
│       │       └── validate.js                # Validate request body (Joi)
│       └── requests/          # Joi schemas cho từng route
│           ├── auth.request.js
│           ├── problems.request.js
│           ├── courses.request.js
│           └── contests.request.js
├── .env.example               # Template biến môi trường
├── .gitignore
└── package.json
```

**Layered architecture:** `Router → Controller → Service → Database (PostgreSQL)`

---

## Tính năng chính

### 🔐 Auth
- Đăng ký tài khoản (username, email, password — hash bằng bcrypt).
- Đăng nhập — trả về JWT Bearer token với thời hạn cấu hình được.
- Đăng xuất — block token bằng in-memory cache (node-cache).
- Đổi mật khẩu — cập nhật hash + tự động block token hiện tại.

### 🧩 Problems (Bài tập lập trình)
- Lấy danh sách bài tập (id, title, slug, difficulty).
- Xem chi tiết bài tập theo `id` hoặc `slug`.
- Nộp bài (submit) — lưu code, status và kết quả chấm.
- Xem lịch sử nộp bài theo `problemId` + `userId`.

### 📚 Courses (Khóa học)
- Liệt kê tất cả khóa học đã xuất bản.
- Xem chi tiết khóa học kèm danh sách module.
- Xem chi tiết một module.
- Tạo / cập nhật / xóa khóa học (Protected).

### 🏆 Contests (Cuộc thi)
- Liệt kê cuộc thi (kèm trạng thái: UPCOMING / ONGOING / FINISHED, thời gian còn lại).
- Xem chi tiết cuộc thi.
- Bảng xếp hạng (ranking) theo số bài nộp thành công.
- Đăng ký tham gia cuộc thi (Protected).
- Tạo / cập nhật / xóa cuộc thi (Protected).

---

## API Endpoints

> Base URL: `http://localhost:<APP_PORT>/api`

### Auth — `/api/auth`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/register` | ✗ | Đăng ký tài khoản mới |
| POST | `/login` | ✗ | Đăng nhập, nhận JWT token |
| POST | `/logout` | ✅ Bearer | Đăng xuất (block token) |
| PATCH | `/:email/reset-password` | ✅ Bearer | Đổi mật khẩu |

### Problems — `/api/problems`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/` | ✗ | Danh sách bài tập |
| GET | `/:idOrSlug` | ✗ | Chi tiết bài tập |
| POST | `/submit` | ✗ | Nộp bài |
| GET | `/:problemId/submissions/:userId` | ✗ | Lịch sử nộp bài |

### Courses — `/api/courses`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/` | ✗ | Danh sách khóa học |
| GET | `/:id` | ✗ | Chi tiết khóa học + modules |
| GET | `/:courseId/modules/:moduleId` | ✗ | Chi tiết module |
| POST | `/` | (Protected) | Tạo khóa học mới |
| PUT | `/:id` | (Protected) | Cập nhật khóa học |
| DELETE | `/:id` | ✅ Bearer | Xóa khóa học |

### Contests — `/api/contests`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/` | ✗ | Danh sách cuộc thi |
| GET | `/:id` | ✗ | Chi tiết cuộc thi |
| GET | `/:id/rankings` | ✗ | Bảng xếp hạng |
| POST | `/:id/register` | ✅ Bearer | Đăng ký tham gia |
| POST | `/` | (Protected) | Tạo cuộc thi mới |
| PUT | `/:id` | (Protected) | Cập nhật cuộc thi |
| DELETE | `/:id` | ✅ Bearer | Xóa cuộc thi |

---

## Yêu cầu môi trường

| Yêu cầu | Phiên bản tối thiểu |
|---|---|
| Node.js | **18.x** trở lên |
| npm | 9.x trở lên |
| PostgreSQL | 13.x trở lên |

---

## Cài đặt & chạy local

### 1. Clone repo & vào thư mục backend

```bash
git clone https://github.com/nguyenhuuniem12022005/SeedGames.git
cd SeedGames/SeedGame-demo/backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo file `.env`

```bash
cp .env.example .env
```

Mở `.env` và điền các giá trị phù hợp (xem phần [Biến môi trường](#biến-môi-trường) bên dưới).

### 4. Chuẩn bị PostgreSQL

Tạo database với tên khớp `DB_NAME` trong `.env`:

```sql
CREATE DATABASE "SeedGame";
```

Sau đó chạy các script SQL để tạo bảng (nếu có file migration/schema):

```bash
# Ví dụ (thay đường dẫn đúng):
psql -U postgres -d SeedGame -f schema.sql
```

> Các bảng cần có: `users`, `problems`, `submissions`, `courses`, `modules`, `contests`, `contest_registrations`.

### 5. Chạy development server

```bash
npm run dev
```

Server khởi động tại: `http://localhost:5000` (hoặc port bạn cấu hình trong `APP_PORT`).

### 6. Chạy production

```bash
npm start
```

---

## Biến môi trường

Tạo file `.env` từ `.env.example`:

| Biến | Mô tả | Mặc định |
|---|---|---|
| `APP_PORT` | Port server lắng nghe | `5000` |
| `SECRET_KEY` | Khóa bí mật ký JWT | *(bắt buộc)* |
| `LOGIN_EXPIRE_IN` | Thời hạn JWT (ví dụ: `1d`, `2h`) | `1d` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Tên database | `SeedGame` |
| `DB_USER` | User PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mật khẩu PostgreSQL | *(bắt buộc)* |

---

## Scripts

```bash
npm run dev    # Chạy development server với nodemon (hot-reload)
npm start      # Chạy production server
```

---

## Roadmap

- [ ] Thêm Refresh Token & cơ chế revoke token bền vững (Redis).
- [ ] Phân quyền theo role (Admin / User).
- [ ] Tích hợp Online Judge / code execution engine.
- [ ] Viết API documentation với Swagger/OpenAPI.
- [ ] Thêm unit test & integration test (Jest / Supertest).
- [ ] Containerize bằng Docker + Docker Compose.
- [ ] CI/CD tự động deploy lên cloud (Railway / Render / VPS).
- [ ] Tối ưu query PostgreSQL (index, pagination chuẩn cursor-based).

---

## Ghi dự án vào CV (Backend Intern)

> Sử dụng format: **Action verb + phạm vi + tech/impact**

```
SeedGame — Backend API  |  Node.js · Express · PostgreSQL · JWT
Role: Backend Developer                          (mm/yyyy – mm/yyyy)

• Developed RESTful API for a game/coding-platform using Node.js (ESM) +
  Express 5.x, following a 3-layer architecture (Router → Controller → Service)
  for clean separation of concerns and maintainability.

• Implemented JWT-based authentication (register / login / logout / reset
  password) with bcrypt password hashing and an in-memory token blocklist
  to support immediate session revocation.

• Built 4 core feature modules — Auth, Problems, Courses, Contests — covering
  full CRUD, submission tracking, real-time contest-status computation, and
  ranked leaderboard queries via PostgreSQL window functions.

• Applied Joi schema validation on all incoming requests and designed a
  centralized error-handling middleware (ApiError class) for consistent HTTP
  responses across the entire API surface.

• Configured PostgreSQL connection pooling (pg Pool) and wrote raw SQL queries
  to maintain fine-grained control over performance-critical operations
  (e.g., ranking with RANK() OVER window function).

• GitHub: github.com/nguyenhuuniem12022005/SeedGames
```

---

## License

ISC License — see [`package.json`](./package.json).
