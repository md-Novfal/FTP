# FTO.EDU — Admission Portal

A three-tier B2B/B2C SaaS platform for educational consultancies to manage student applications to universities abroad.

## Monorepo Structure

```
FTP/
├── ui/        # React 18 frontend (Create React App)
├── server/    # Node.js + Express backend API
├── docker-compose.yml
└── package.json
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Material UI v5 |
| Backend | Node.js 20, Express 4, PostgreSQL 15, Sequelize |
| Auth | JWT + OTP via Twilio |
| File Storage | AWS S3 + Multer |
| Email | SendGrid |
| Realtime | Socket.io |
| Payments | Razorpay (Phase 2) |
| Infra | Docker, GitHub Actions CI |

## User Roles

- **Admin** — full control over users, applications, content, commissions
- **Agency** — manage student profiles, submit applications, view commissions
- **Student** — self-register, upload documents, track application status

## Application Status Pipeline

```
Apply → Under Review → College Submitted → Offer Letter → Interview
→ Admission Letter → Ministry Order → VFS → Visa → Ticket → Arrived
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 9+

### 1. Clone the repo

```bash
git clone git@github.com:md-Novfal/FTP.git
cd FTP
```

### 2. Set up environment variables

```bash
cp server/.env.example server/.env
cp ui/.env.example ui/.env
```

Edit both `.env` files with your credentials.

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Start development servers

```bash
npm run dev
```

- UI: http://localhost:3000
- API: http://localhost:5000
- Health check: http://localhost:5000/health

---

## Docker (optional)

```bash
docker-compose up --build
```

---

## Project Structure

### `server/`

```
server/
├── src/
│   ├── config/         # DB connection, logger
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Auth (JWT/RBAC), error handler, file upload
│   ├── models/         # Sequelize models (User, Profile, Application, Document, ...)
│   ├── routes/         # Express route definitions
│   ├── socket/         # Socket.io setup
│   └── index.js        # Entry point
├── Dockerfile
└── package.json
```

### `ui/`

```
ui/
├── src/
│   ├── components/     # Reusable UI components (Navbar, Sidebar, TopBar, ...)
│   ├── layouts/        # PublicLayout, DashboardLayout
│   ├── pages/
│   │   ├── public/     # HomePage, LoginPage, RegisterPage, VerifyOtpPage
│   │   ├── admin/      # AdminDashboard, AdminApplications, AdminUsers
│   │   ├── agency/     # AgencyDashboard, AgencyApplications
│   │   └── student/    # StudentDashboard, StudentProfile, StudentApplications
│   ├── services/       # Axios API client + Socket.io
│   ├── store/          # Redux slices (auth, applications, notifications, ui)
│   ├── theme/          # MUI theme config
│   └── index.js        # Entry point
├── Dockerfile
└── package.json
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Student self-registration |
| POST | `/api/auth/login` | Login (all roles) |
| POST | `/api/auth/verify-otp` | OTP verification |
| GET | `/api/applications` | List applications (role-filtered) |
| POST | `/api/applications` | Submit application |
| PUT | `/api/applications/:id/status` | Update status (admin) |
| POST | `/api/documents` | Upload document |
| PUT | `/api/documents/:id/verify` | Verify document (admin) |
| GET | `/api/notifications` | Get notifications |
| GET | `/api/admin/analytics` | Admin analytics |
| GET | `/api/commissions` | Commission list |
| POST | `/api/chat/messages` | Send chat message |

Full API documentation will be available via Swagger at `/api/docs`.

---

## Development Phases

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 (8-10 wks) | Core MVP — auth, profiles, applications, documents | 🔧 In Progress |
| Phase 2 (8-10 wks) | Payments, chat, commissions, content management | ⏳ Pending |
| Phase 3 (4-6 wks) | Analytics, security audit, scaling | ⏳ Pending |
