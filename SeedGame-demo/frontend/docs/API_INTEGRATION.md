# API Integration Guide

Hướng dẫn tích hợp frontend với backend API.

## Cấu trúc

### 1. Types & Interfaces (`types/api.ts`)

Định nghĩa tất cả các types và interfaces cho API responses:
- `Problem`, `Course`, `Contest`, `SandboxProject`, etc.
- `RunRequest`, `RunResult`, `ApiError`, etc.

### 2. API Client (`lib/api-client.ts`)

API client chính với các tính năng:
- Tự động thêm headers (Content-Type, Authorization)
- Error handling tự động
- Type-safe requests/responses
- Support cho GET, POST, PUT, DELETE, PATCH

### 3. API Methods

Các API methods được tổ chức theo module:

```typescript
import { problemsApi, runApi, coursesApi, contestsApi, sandboxApi } from '@/lib/api-client';

// Get all problems
const response = await problemsApi.getAll();
if (response.data) {
  console.log(response.data.problems);
}

// Run code
const runResponse = await runApi.execute({
  problemId: '1',
  code: 'void update() { hero.moveRight(); }',
  language: 'javascript'
});
```

## Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=/api
# Hoặc cho production:
# NEXT_PUBLIC_API_BASE_URL=https://api.seedgame.com
```

## Error Handling

Sử dụng `handleApiError` từ `lib/errors`:

```typescript
import { handleApiError } from '@/lib/errors';

const response = await problemsApi.getAll();
if (response.error) {
  const errorMessage = handleApiError(response.error);
  // Hiển thị error message cho user
}
```

## Cấu trúc Response

Tất cả API responses đều có format:

```typescript
{
  data?: T;        // Success data
  error?: ApiError; // Error object
  message?: string; // Optional message
}
```

## Authentication

API client tự động thêm token từ `localStorage.getItem('auth_token')`.

Để set token:
```typescript
localStorage.setItem('auth_token', 'your-token-here');
```

## Ví dụ sử dụng

### Trong Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { problemsApi } from '@/lib/api-client';
import { handleApiError } from '@/lib/errors';
import type { Problem } from '@/types/api';

export default function ProblemsList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    problemsApi.getAll().then((response) => {
      if (response.error) {
        setError(handleApiError(response.error));
      } else if (response.data) {
        setProblems(response.data.problems);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {problems.map(problem => (
        <div key={problem.id}>{problem.title}</div>
      ))}
    </div>
  );
}
```

## Backend Requirements

Backend cần implement các endpoints:

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem by ID

### Run Code
- `POST /api/run` - Execute code
  ```json
  {
    "problemId": "1",
    "code": "void update() { ... }",
    "language": "javascript"
  }
  ```

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/:id/modules/:moduleId` - Get module

### Contests
- `GET /api/contests` - List all contests
- `GET /api/contests/:id` - Get contest by ID
- `GET /api/contests/:id/rankings` - Get rankings
- `POST /api/contests/:id/register` - Register for contest

### Sandbox
- `GET /api/sandbox` - List all projects
- `GET /api/sandbox/:id` - Get project by ID
- `POST /api/sandbox` - Create project
- `PUT /api/sandbox/:id` - Update project
- `DELETE /api/sandbox/:id` - Delete project

## Notes

- Tất cả API calls đều async và trả về Promise
- Luôn check `response.error` trước khi dùng `response.data`
- Sử dụng TypeScript types để đảm bảo type safety
- API client tự động handle network errors

