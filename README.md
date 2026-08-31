# Lingoz

A real-time language-learning chat platform that connects people across language barriers. Built as a full-stack monorepo with a React 19 frontend, a Node.js/Express backend, WebSocket messaging, AI-powered smart replies, and real-time translation via DeepL.

## Resume Highlights

- Real-time messaging with Socket.IO, including delivery/read states and multi-device session support.
- AI-assisted conversations with Gemini-generated reply suggestions and DeepL translation.
- JWT authentication, Google OAuth 2.0, password reset flows, and onboarding/profile management.
- Redis-backed online presence and socket state, with PostgreSQL persistence through Prisma.
- Shared TypeScript and Zod schemas in a monorepo to keep frontend and backend types aligned.

---

## Features

- **Real-Time Messaging** — Direct and group chats powered by Socket.IO with per-message delivery/read status tracking (Undelivered → Delivered → Read) across multi-device sessions.
- **Authentication** — JWT-based auth + Google OAuth 2.0. Multi-step password reset with time-limited OTP sent via email queue.
- **AI Smart Replies** — Gemini AI generates three context-aware reply suggestions per received message, matching the conversation language.
- **Message Translation** — DeepL integration for real-time in-chat message translation enabling cross-language conversations.
- **User Discovery** — Browse users by language (speaking/learning), country, city, and online status with cursor-based infinite scroll.
- **Friend System** — Send, accept, reject, and cancel friend requests; remove connections.
- **Online Presence** — Live online/offline status and last-seen timestamps tracked via Redis sets.
- **Profile Management** — Onboarding flow, profile editing, language preferences, and profile photo upload via Cloudinary.
- **Transactional Emails** — Welcome and password-reset emails delivered via Resend through a BullMQ background worker with exponential backoff retries.
- **Favorites** — Pin conversations to a favorites list.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Styling |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state & caching |
| Socket.IO Client | Real-time communication |
| React Hook Form + Zod | Forms & validation |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| Vitest + MSW | Unit testing & API mocking |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | API server |
| TypeScript | Type safety |
| Socket.IO | WebSocket server |
| PostgreSQL | Primary relational database |
| Prisma ORM | Database access & migrations |
| Redis (ioredis) | Online presence, socket tracking, open-chat state |
| BullMQ | Background job queue (email worker) |
| Resend | Transactional email delivery |
| Google Gemini AI | Smart reply suggestions |
| DeepL | Message translation |
| Cloudinary | Profile photo storage |
| JWT + bcrypt | Authentication & password hashing |
| Google Auth Library | OAuth 2.0 token verification |
| Multer | Multipart file upload |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Full-stack containerization |
| Prisma Migrations | Database schema versioning |
| npm workspaces | Monorepo package management |

---

## Architecture Overview

```
lingua-chat/
├── frontend/          # React 19 SPA (Vite)
│   └── src/
│       ├── features/  # auth, chats, friends, network, onboarding, profile
│       ├── components/ # shared UI components
│       ├── providers/ # React context providers
│       ├── sockets/   # Socket.IO client setup
│       └── lib/       # axios instance, query client
│
├── backend/           # Express REST API + Socket.IO server
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── services/      # Business logic
│       ├── repositories/  # Prisma data access layer
│       ├── routes/        # Express routers
│       ├── sockets/       # Socket.IO event handlers
│       ├── queues/        # BullMQ queue definitions
│       ├── workers/       # BullMQ background workers (email)
│       ├── middleware/     # Auth, error handling, upload
│       ├── utils/         # JWT, crypto, cursor helpers
│       ├── config/        # DB, Redis, Gemini, Cloudinary, env
│       └── redis/         # Redis key schema
│
├── shared/            # Shared TypeScript types & Zod schemas (@linguachat/shared)
│   └── src/
│       └── schemas/   # Zod validation schemas used by both frontend & backend
│
└── docker-compose.yml # Orchestrates all services
```

### Key Design Decisions

- **Monorepo with shared package** — A `@linguachat/shared` internal package contains Zod schemas and TypeScript types consumed by both the frontend and backend, ensuring end-to-end type safety without duplication.
- **Repository pattern** — All Prisma queries are isolated in repository files; services contain only business logic and never touch the ORM directly.
- **Redis for real-time state** — User socket IDs are stored as Redis sets (`user:{id}:sockets`). Open-chat state per socket (`user:{id}:socket:{socketId}:openChat`) determines whether an incoming message should be marked as `Read` (chat open), `Delivered` (user online), or `UnDelivered` (user offline) — all resolved in a single pass before the message is written to PostgreSQL.
- **Decoupled email delivery** — Emails are never sent inline. A BullMQ job is enqueued (with retry/backoff config) and consumed by a separate worker process, keeping the API response fast and resilient to email provider outages.
- **Cursor-based pagination** — Both user discovery and chat message history use opaque cursor tokens (encoded timestamps + IDs) instead of offset pagination, avoiding the duplicate/skip problem at scale.

---

## Data Models

```
User ─── UserLanguage          (speaking / learning languages)
     ─── FriendRequest         (PENDING / APPROVED / REJECTED)
     ─── Friendship
     ─── ChatParticipant ───── Chat (Direct | Group)
                                 └── Message
                                       └── MessageStatus  (per recipient)
```

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js ≥ 20 (for local development without Docker)

### Environment Variables

Copy the example env files and fill in your credentials:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Backend** (`backend/.env`):
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres-db:5432/linguachat
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=LinguaChat <onboarding@resend.dev>
REDIS_URL=redis://redis:6379
GEMINI_API_KEY=your_gemini_api_key
DEEPL_AUTH_KEY=your_deepl_auth_key
CLOUDINARY_URL=your_cloudinary_url
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Run with Docker (recommended)

```bash
# Start all services (API, worker, frontend, PostgreSQL, Redis)
docker compose up --build

# Run initial database migrations (first time only)
docker compose exec api-server npm run prisma:migrate -- --name init
```

| Service     | URL                          |
|-------------|------------------------------|
| Frontend    | http://localhost:5173        |
| API Server  | http://localhost:3000        |
| Adminer     | http://localhost:8080        |
| RedisInsight| http://localhost:5540        |

### Local Development (without Docker)

```bash
# Install dependencies at workspace root
npm install

# Start backend (requires local PostgreSQL and Redis)
cd backend && npm run dev

# Start frontend (in a new terminal)
cd frontend && npm run dev

# Start email worker (in a new terminal)
cd backend && npm run worker
```

### Database Management

```bash
# Run a new migration inside the running container
docker compose exec api-server npm run prisma:migrate -- --name <migration_name>

# Reset the database
docker compose exec api-server npm run prisma:reset

# Install a new backend dependency inside the container
docker compose exec api-server npm install <package>

# Install a new frontend dependency inside the container
docker compose exec frontend npm install <package>
```

---

## Running Tests

```bash
cd frontend
npm run test        # run once
npm run test:watch  # watch mode
```

Tests use **Vitest** for the test runner and **MSW (Mock Service Worker)** to intercept API calls, simulating a real backend without a live server.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/forgot-password` | Request OTP |
| POST | `/api/auth/verify-otp` | Verify OTP → get reset token |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/users/me` | Get current user profile |
| PATCH | `/api/users/me` | Update profile + photo upload |
| PATCH | `/api/users/me/languages` | Update speaking/learning languages |
| GET | `/api/users` | Discover users (with filters + cursor) |
| POST | `/api/friends/request` | Send friend request |
| PATCH | `/api/friends/request/:id` | Accept / reject request |
| DELETE | `/api/friends/request/:id` | Cancel sent request |
| DELETE | `/api/friends/:id` | Remove friendship |
| GET | `/api/friends/connections` | List accepted connections |
| GET | `/api/chats` | List user's chats |
| POST | `/api/chats/direct/:userId` | Get or create direct chat |
| GET | `/api/chats/:chatId/messages` | Paginated message history |
| GET | `/api/chats/messages/:messageId/suggestions` | AI reply suggestions |
| PATCH | `/api/chats/:chatId/favourites` | Toggle chat favourite |

### Socket.IO Events

| Event (client → server) | Description |
|---|---|
| `chat:new_message` | Send a message to a chat |
| `chat:open` | Mark a chat as open (triggers read receipts) |
| `chat:close` | Mark a chat as closed |

| Event (server → client) | Description |
|---|---|
| `chat:new_message` | Receive a new message |
| `chat:open` | Recipient opened the chat (messages marked read) |
| `chat:messages_delivered` | Messages delivered on reconnect |

---

## License

MIT
