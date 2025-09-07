
# URL Shortener

A full-stack URL shortener with a robust Express.js backend and modern React frontend. Transform long URLs into short, shareable links with user authentication and management features.

***

## 🌟 Features

- 🔗 **URL Shortening**: Convert long URLs into short, memorable links
- 🚀 **Instant Redirects**: Fast public redirect service for shortened URLs
- 📊 **URL Management**: Create, view, and delete your shortened URLs
- 📋 **Copy to Clipboard**: Easy sharing with one-click copy functionality
- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 👤 **Personal Dashboard**: Manage all your URLs in one place
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚙️ **Configurable API**: Easy backend URL configuration for different environments
- 🛡️ **Security Features**: Helmet, CORS, rate limiting, Zod input validation
- 🔒 **Password Security**: bcrypt hashing with configurable salt rounds
- 🗄️ **Database**: PostgreSQL with Drizzle ORM for reliable data management
- ⚡ **Fast Development**: Vite with HMR for instant feedback

***

## 🏗️ Architecture

**Backend API (`/`)**
- Express.js 5.x with Node.js (ES Modules)
- PostgreSQL + Drizzle ORM
- JWT authentication with bcrypt
- Security: Helmet, CORS, rate limiting, Zod validation
- Logging: Pino

**Frontend Application (`/FrontEnd/`)**
- React 19.x with Vite 7.x
- Modern CSS3, Fetch API for backend communication

***

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### 1. Backend Setup

```bash
git clone <repository-url>
cd url-shortener
npm install
cp .env.example .env
# Edit .env with your config
npm run drizzle:push
npm run dev
```
Backend available at `http://localhost:3000`

### 2. Frontend Setup

```bash
cd FrontEnd
npm install
npm run dev
```
Frontend at `http://localhost:5173`

***

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgres://username:password@localhost:5432/database_name
PORT=3000
BASE_URL=http://localhost:3000
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=1h
SALT_ROUNDS=10
LOG_LEVEL=info
```

***

## 📁 Project Structure

```
url-shortener/
├── FrontEnd/              # React frontend
├── src/                   # Backend source
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── middleware/        # Express middleware
├── .env.example           # Env template
├── package.json           # Backend deps
└── README.md
```

***

## 📚 API Documentation

### Endpoints

| Method | Endpoint                  | Description                  | Auth Required |
|--------|---------------------------|------------------------------|---------------|
| POST   | `/api/auth/register`      | Register a new user          | No            |
| POST   | `/api/auth/login`         | Login and get JWT token      | No            |
| POST   | `/api/url/shorten`        | Create a short URL           | Yes           |
| GET    | `/api/url/urls`           | Get all user's URLs          | Yes           |
| DELETE | `/api/url/urls/:id`       | Delete a specific URL        | Yes           |
| GET    | `/:shortcode`             | Redirect to original URL     | No            |

### Usage Flow

1. **Register/Login** → Get JWT token
2. **Shorten URLs** → Auth required
3. **Manage URLs** → List, delete your URLs
4. **Share Links** → Public shortcodes

#### Example Request

Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "SecurePass123!"
  }'
```

Authenticate, create, list, delete, and redirect—all endpoints and example curl commands above.

***

## 🗄️ Database Schema

The application uses PostgreSQL with Drizzle ORM and consists of two main tables: `users` and `urls`.

### Users Table (`users`)

```js
import { pgTable, varchar, text, timestamp, uuid, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    password: text('password').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    email_unique: uniqueIndex('users_email_unique').on(table.email),
    phone_unique: uniqueIndex('users_phone_unique').on(table.phone),
    created_at_index: index('users_created_at_index').on(table.created_at),
  })
);
```

| Column       | Type         | Constraints                            | Description                |
|--------------|--------------|----------------------------------------|----------------------------|
| id           | UUID         | PRIMARY KEY, DEFAULT random()          | Unique user identifier     |
| name         | VARCHAR(255) | NOT NULL                               | Full name                  |
| email        | VARCHAR(255) | NOT NULL, UNIQUE                       | User's email               |
| phone        | VARCHAR(20)  | NOT NULL, UNIQUE                       | User's phone number        |
| password     | TEXT         | NOT NULL                               | bcrypt hashed password     |
| created_at   | TIMESTAMP    | NOT NULL, DEFAULT NOW()                | Account creation           |
| updated_at   | TIMESTAMP    | NOT NULL, DEFAULT NOW()                | Last updated               |

### URLs Table (`urls`)

```js
import { pgTable, varchar, text, timestamp, uuid, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { users } from './user.model.js';

export const urls = pgTable(
  'urls',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    shortcode: varchar('shortcode', { length: 64 }).notNull(),
    targeturl: text('targeturl').notNull(),
    userid: uuid('userid')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    shortcode_unique: uniqueIndex('urls_shortcode_unique').on(table.shortcode),
    user_id_index: index('urls_user_id_index').on(table.userid),
    created_at_index: index('urls_created_at_index').on(table.created_at),
  })
);
```

| Column      | Type         | Constraints                                 | Description                      |
|-------------|--------------|---------------------------------------------|----------------------------------|
| id          | UUID         | PRIMARY KEY, DEFAULT random()               | Unique URL record                |
| shortcode   | VARCHAR(64)  | NOT NULL, UNIQUE                            | Generated short code             |
| targeturl   | TEXT         | NOT NULL                                    | Original long URL                |
| userid      | UUID         | NOT NULL, FOREIGN KEY (users.id, CASCADE)   | References users.id              |
| created_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW()                     | URL creation timestamp           |
| updated_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW()                     | Last updated                     |

- **Indexes:** On email, phone, shortcode, user id, created_at for efficient query/filtering.
- **Foreign Key:** URLs belong to users, cascade delete/update.

***

## 🔒 Security Features

- JWT authentication/authorization
- bcrypt password hashing
- Helmet, rate limiting, CORS
- Zod input validation
- SQL injection prevention (Drizzle ORM)
- Error handler middleware

***

## 🧪 API Testing Guide

Automate end-to-end API tests (example with Jest+Supertest in `/test/api.e2e.test.js`). Curl commands provided above for manual verification.

***

## 🚀 Deployment

- Configure `.env` for production/preview
- Run `npm start` for backend, `npm run build` for frontend, deploy static `/dist`

***

**Made with ❤️ using Express.js, React, PostgreSQL, Drizzle ORM, and Vite**

***

You can **copy-paste** this into your README.md!  
Adjust the details of contributors, repo link, or notes as needed. This README is suitable for portfolios, open source, or production onboarding.