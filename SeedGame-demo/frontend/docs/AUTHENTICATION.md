# Authentication System

Hệ thống xác thực đã được tích hợp vào SeedGame frontend.

## Cấu trúc

### 1. Auth Context (`contexts/AuthContext.tsx`)
- Quản lý authentication state toàn cục
- Cung cấp các methods: `login`, `register`, `logout`, `updateUser`
- Tự động check authentication khi app load
- Lưu token vào localStorage

### 2. Auth Types (`types/api.ts`)
- `User` - Thông tin người dùng
- `LoginRequest` - Dữ liệu đăng nhập
- `RegisterRequest` - Dữ liệu đăng ký
- `AuthResponse` - Response từ auth API
- `UserStats` - Thống kê người dùng

### 3. Auth API (`lib/api-client.ts`)
- `authApi.login()` - Đăng nhập
- `authApi.register()` - Đăng ký
- `authApi.logout()` - Đăng xuất
- `authApi.getCurrentUser()` - Lấy thông tin user hiện tại
- `authApi.updateProfile()` - Cập nhật profile
- `authApi.refreshToken()` - Refresh token

## Pages

### 1. Login Page (`/login`)
- Form đăng nhập với email và password
- Link đến trang đăng ký
- Link quên mật khẩu (placeholder)
- Tự động redirect đến `/profile` sau khi đăng nhập thành công

### 2. Register Page (`/register`)
- Form đăng ký với:
  - Username (required)
  - Full name (optional)
  - Email (required)
  - Password (required, min 6 chars)
  - Confirm password (required)
- Validation:
  - Password match
  - Password length
  - Terms acceptance
- Tự động redirect đến `/profile` sau khi đăng ký thành công

### 3. Profile Page (`/profile`)
- **Protected route** - Tự động redirect đến `/login` nếu chưa đăng nhập
- 3 tabs:
  - **Thông tin cá nhân**: Chỉnh sửa profile (fullName, bio)
  - **Thống kê**: Hiển thị stats (problems solved, contests participated, projects uploaded)
  - **Cài đặt**: Settings (notifications, etc.)
- Logout button

## Header Integration

Header đã được cập nhật để:
- Hiển thị avatar/user info khi đã đăng nhập
- Hiển thị "Đăng nhập" và "Đăng ký" buttons khi chưa đăng nhập
- Link avatar đến `/profile`
- Loading state khi check authentication

## Cách sử dụng

### Trong Component

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.fullName || user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

## Backend Endpoints cần implement

### POST `/api/auth/login`
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "username": "username",
    "email": "user@example.com",
    "fullName": "Full Name",
    "avatar": "https://...",
    "bio": "Bio text",
    "createdAt": "2024-01-01T00:00:00Z",
    "stats": {
      "problemsSolved": 10,
      "contestsParticipated": 5,
      "projectsUploaded": 3,
      "totalScore": 1500,
      "rank": 42
    }
  },
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here"
}
```

### POST `/api/auth/register`
Request:
```json
{
  "username": "username",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Full Name"
}
```

Response: Same as login

### POST `/api/auth/logout`
Response:
```json
{
  "success": true
}
```

### GET `/api/auth/me`
Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "user": {
    "id": 1,
    "username": "username",
    "email": "user@example.com",
    ...
  }
}
```

### PUT `/api/auth/profile`
Headers:
```
Authorization: Bearer <token>
```

Request:
```json
{
  "fullName": "New Name",
  "bio": "New bio"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "username": "username",
    "fullName": "New Name",
    "bio": "New bio",
    ...
  }
}
```

### POST `/api/auth/refresh`
Request:
```json
{
  "refreshToken": "refresh-token-here"
}
```

Response:
```json
{
  "token": "new-jwt-token-here"
}
```

## Token Management

- Token được lưu trong `localStorage.getItem('auth_token')`
- Refresh token được lưu trong `localStorage.getItem('refresh_token')`
- API client tự động thêm token vào headers
- Token được clear khi logout

## Error Handling

Tất cả auth operations đều có error handling:
- Validation errors từ form
- API errors từ backend
- Network errors
- Invalid token errors

Errors được hiển thị trong UI với message rõ ràng.

## Security Notes

- Passwords không được lưu trong frontend
- Tokens được lưu trong localStorage (có thể upgrade lên httpOnly cookies)
- Tất cả API calls đều có Authorization header
- Protected routes tự động redirect nếu chưa đăng nhập

