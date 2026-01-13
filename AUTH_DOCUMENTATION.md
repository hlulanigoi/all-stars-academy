# JWT Authentication System Documentation

## Overview
Robust JWT-based authentication system implemented for All Stars Excellency Academy website.

## Backend Implementation

### Database Schema
**Users Table:**
- `id` (serial, primary key)
- `name` (text, required)
- `email` (text, unique, required)
- `password` (text, hashed with bcrypt, required)
- `created_at` (timestamp, auto-generated)

### API Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- Name: minimum 2 characters
- Email: valid email format
- Password: minimum 6 characters

---

#### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3. Verify Token
**GET** `/api/auth/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### 4. Logout
**POST** `/api/auth/logout`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

Note: With JWT, logout is handled client-side by removing the token.

---

## Frontend Implementation

### Components

1. **AuthContext** (`/client/src/contexts/AuthContext.tsx`)
   - Manages authentication state
   - Provides `login`, `register`, `logout` functions
   - Auto-verifies token on mount
   - Persists token in localStorage

2. **Login Page** (`/client/src/pages/Login.tsx`)
   - Email and password form
   - Error handling with toast notifications
   - Redirect to dashboard on success

3. **Register Page** (`/client/src/pages/Register.tsx`)
   - Name, email, password, confirm password fields
   - Client-side validation
   - Redirect to dashboard on success

4. **Dashboard Page** (`/client/src/pages/Dashboard.tsx`)
   - Protected page for authenticated users
   - Displays user information
   - Quick links to other pages
   - Logout functionality

5. **ProtectedRoute Component** (`/client/src/components/ProtectedRoute.tsx`)
   - Wrapper for protected routes
   - Redirects to login if not authenticated
   - Shows loading state during verification

6. **Updated Navbar** (`/client/src/components/Navbar.tsx`)
   - Shows Login/Register for guests
   - Shows Dashboard/Logout for authenticated users
   - Responsive mobile menu

---

## Usage Examples

### Frontend Usage

**Using AuthContext in a component:**
```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <button onClick={() => login(email, password)}>
          Login
        </button>
      )}
    </div>
  );
}
```

**Creating a protected route:**
```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";

<Route path="/dashboard">
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
</Route>
```

---

## Security Features

1. **Password Hashing:** bcrypt with salt rounds of 10
2. **JWT Expiration:** 7 days
3. **Token Format:** Bearer token in Authorization header
4. **Protected Routes:** Middleware validates JWT on each request
5. **Input Validation:** Zod schemas for all inputs
6. **Error Handling:** Proper error messages without exposing sensitive info

---

## Environment Variables

```env
DATABASE_URL=postgresql://appuser:apppassword@localhost:5432/allstars_academy
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
PORT=5000
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` in production!

---

## Testing

All authentication endpoints have been tested:
✓ User registration
✓ User login
✓ Token verification
✓ Invalid credentials rejection
✓ Unauthorized access prevention

Run manual tests:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Verify (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer TOKEN"
```

---

## Routes

**Public Routes:**
- `/` - Home
- `/about` - About
- `/subjects` - Subjects
- `/pricing` - Pricing
- `/schedule` - Schedule
- `/contact` - Contact
- `/login` - Login page
- `/register` - Registration page

**Protected Routes:**
- `/dashboard` - User dashboard (requires authentication)

---

## Database Setup

PostgreSQL database is automatically configured with supervisor.

**View users:**
```bash
sudo -u postgres psql -d allstars_academy -c "SELECT * FROM users;"
```

**Schema migrations:**
```bash
npm run db:push
```

---

## Future Enhancements

Possible additions:
- Password reset functionality
- Email verification
- OAuth integration (Google, Facebook)
- Role-based access control (RBAC)
- Refresh tokens
- Two-factor authentication (2FA)
- User profile editing
- Password change functionality

---

## Troubleshooting

**Server not starting:**
```bash
sudo supervisorctl status app
tail -50 /var/log/supervisor/app.err.log
```

**Database connection issues:**
```bash
sudo service postgresql status
sudo -u postgres psql -d allstars_academy -c "SELECT 1;"
```

**Frontend can't connect to backend:**
- Check that server is running on port 5000
- Verify API endpoints start with `/api/`
- Check browser console for CORS errors

---

## Architecture

```
┌─────────────────┐
│   React Client  │
│   (Port 5000)   │
└────────┬────────┘
         │
         │ HTTP Requests
         │ (JWT in Header)
         │
┌────────▼────────┐
│  Express.js API │
│   (Port 5000)   │
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Port 5432)   │
└─────────────────┘
```

---

## Files Modified/Created

**Backend:**
- `/app/shared/schema.ts` - Added users table and schemas
- `/app/server/storage.ts` - Added user CRUD methods
- `/app/server/middleware/auth.ts` - JWT middleware (NEW)
- `/app/server/routes.ts` - Added auth routes
- `/app/shared/routes.ts` - Added auth API definitions

**Frontend:**
- `/app/client/src/contexts/AuthContext.tsx` - Auth context (NEW)
- `/app/client/src/pages/Login.tsx` - Login page (NEW)
- `/app/client/src/pages/Register.tsx` - Register page (NEW)
- `/app/client/src/pages/Dashboard.tsx` - Dashboard page (NEW)
- `/app/client/src/components/ProtectedRoute.tsx` - Protected route wrapper (NEW)
- `/app/client/src/components/Navbar.tsx` - Updated with auth buttons
- `/app/client/src/App.tsx` - Updated with auth routes and provider
- `/app/client/src/hooks/use-contact.ts` - Fixed import

**Configuration:**
- `/app/.env` - Environment variables (NEW)
- `/etc/supervisor/conf.d/app.conf` - Supervisor config (NEW)
- `/app/package.json` - Added jwt and bcrypt packages

---

## Status: ✅ FULLY IMPLEMENTED AND TESTED

All authentication features are working correctly and ready for use!
