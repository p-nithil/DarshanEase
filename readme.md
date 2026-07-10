# DarshanEase 🛕 — Temple Darshan Booking Platform

A full-stack, production-ready Indian ethnic-themed darshan booking application. Book VIP darshans, manage temple schedules, and coordinate pilgrim visits with ease.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

---

## 📁 Project Structure

```
darshanease/
  client/       → Next.js 16 frontend (App Router, Tailwind CSS v4, TypeScript)
  server/       → Express.js backend (MongoDB, JWT, Zod)
```

---

## ⚙️ Backend Setup (server/)

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment variables
Copy `env.example` to `.env` and fill in your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/darshanease
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 3. Seed the database
```bash
npm run seed
```
This creates:
- **Admin**: `admin@darshanease.com` / `admin123`
- **User**: `user@darshanease.com` / `user123`
- 3 Temples: Kedarnath, Meenakshi Amman, Tirupati Balaji
- 252 active time slots for the next 7 days

### 4. Start the server
```bash
npm run dev     # development (nodemon)
npm start       # production
```
Server runs at: **http://localhost:5000**

---

## 🎨 Frontend Setup (client/)

### 1. Install dependencies
```bash
cd client
npm install
```

### 2. Start the dev server
```bash
npm run dev
```
Frontend runs at: **http://localhost:3000**

> API requests to `/api/*` are automatically proxied to `http://localhost:5000` via `next.config.ts` rewrites.

---

## 👥 User Roles

| Role  | Access |
|-------|--------|
| Guest | Home, Temples, About, Contact, Login, Signup |
| User  | All guest pages + Dashboard, My Bookings, Profile |
| Admin | User access + Admin panel (Temples, Slots, Bookings, Users) |

---

## 📖 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new devotee |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get session user |
| GET | `/api/temples` | List temples (search/filter/sort) |
| GET | `/api/temples/:id` | Temple details |
| POST | `/api/temples` | Create temple (admin) |
| PUT | `/api/temples/:id` | Update temple (admin) |
| DELETE | `/api/temples/:id` | Delete temple (admin) |
| GET | `/api/slots` | List slots |
| GET | `/api/slots/temple/:id` | Slots by temple |
| POST | `/api/slots` | Create slot (admin) |
| POST | `/api/slots/generate` | Bulk generate slots (admin) |
| POST | `/api/bookings` | Book tickets |
| GET | `/api/bookings/my` | My bookings |
| GET | `/api/bookings/all` | All bookings (admin) |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/status` | Admin status update |
| GET | `/api/users` | All users (admin) |
| PUT | `/api/users/profile/update` | Update own profile |
| PUT | `/api/users/profile/password` | Change own password |

---

## 🎨 Design Theme

- **Fonts**: Cinzel (headings), Lora (body)
- **Colors**: Saffron `#D97706`, Maroon `#7C1C1C`, Gold `#F59E0B`, Cream `#FAF6F0`
- **UI**: Mandala watermarks, ethnic borders, temple-style card layouts
- **Icons**: Lucide React

---

## 🛡️ Security

- JWT tokens stored in secure HTTP-only cookies (30 day expiry)
- Passwords hashed with bcryptjs (salt rounds: 10)
- Role-based route protection (middleware + frontend guards)
- Zod schema validation on all POST/PUT endpoints
- Atomic slot deductions to prevent race condition double-bookings