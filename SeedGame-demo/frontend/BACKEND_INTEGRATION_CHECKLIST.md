# Backend Integration Checklist ✅

Danh sách kiểm tra để đảm bảo frontend sẵn sàng kết nối với backend.

## ✅ Đã hoàn thành

### Core Infrastructure
- [x] API Client với error handling
- [x] Types và interfaces đầy đủ
- [x] Auth Context và authentication system
- [x] Error handling utilities
- [x] Loading states
- [x] Protected routes

### Pages
- [x] Login page với API integration
- [x] Register page với API integration
- [x] Profile page với protected route
- [x] Problems page với API integration
- [x] Problem detail page với run code API
- [x] Sandbox page với API integration
- [x] Sandbox upload page với auth check

### Components
- [x] Header với auth state
- [x] Footer
- [x] LoadingSpinner component
- [x] ErrorBoundary component

### Utilities
- [x] useProtectedRoute hook
- [x] API client methods
- [x] Error handling functions

## 📋 Cần Backend Implement

### Authentication Endpoints
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/me`
- [ ] `PUT /api/auth/profile`
- [ ] `POST /api/auth/refresh`

### Problems Endpoints
- [ ] `GET /api/problems`
- [ ] `GET /api/problems/:id`
- [ ] `POST /api/run`

### Courses Endpoints
- [ ] `GET /api/courses`
- [ ] `GET /api/courses/:id`
- [ ] `GET /api/courses/:id/modules/:moduleId`

### Contests Endpoints
- [ ] `GET /api/contests`
- [ ] `GET /api/contests/:id`
- [ ] `GET /api/contests/:id/rankings`
- [ ] `POST /api/contests/:id/register`

### Sandbox Endpoints
- [ ] `GET /api/sandbox`
- [ ] `GET /api/sandbox/:id`
- [ ] `POST /api/sandbox`
- [ ] `PUT /api/sandbox/:id`
- [ ] `DELETE /api/sandbox/:id`

## 🔧 Configuration

### Environment Variables
Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=/api
```

Hoặc cho production:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.seedgame.com
```

## 📝 Notes

### Pages cần cập nhật khi backend ready:
1. **Courses page** (`app/courses/page.tsx`) - Hiện đang dùng mock data
2. **Contest page** (`app/contest/page.tsx`) - Hiện đang dùng mock data
3. **Course detail pages** - Cần tích hợp API

### Optional Enhancements (có thể làm sau):
- [ ] Pagination component
- [ ] Toast notifications
- [ ] Form validation library
- [ ] Image upload component
- [ ] Search functionality
- [ ] Filter components

## 🚀 Ready to Connect

Frontend đã sẵn sàng! Chỉ cần:
1. Backend implement các endpoints theo spec trong `docs/API_INTEGRATION.md`
2. Set environment variable `NEXT_PUBLIC_API_BASE_URL`
3. Test integration

## 📚 Documentation

- `docs/API_INTEGRATION.md` - API integration guide
- `docs/AUTHENTICATION.md` - Authentication system guide
- `FRONTEND_READY.md` - Frontend readiness summary

