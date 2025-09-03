# URL Shortener

A full-stack URL shortener application with a robust Express.js backend and modern React frontend. Transform long URLs into short, shareable links with user authentication and management features.

## 🌟 Features

### Core Functionality

- 🔗 **URL Shortening**: Convert long URLs into short, memorable links
- 🚀 **Instant Redirects**: Fast public redirect service for shortened URLs
- 📊 **URL Management**: Create, view, and delete your shortened URLs
- 📋 **Copy to Clipboard**: Easy sharing with one-click copy functionality

### User Experience

- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 👤 **Personal Dashboard**: Manage all your URLs in one place
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚙️ **Configurable API**: Easy backend URL configuration for different environments

### Security & Performance

- 🛡️ **Security Features**: Helmet, CORS, rate limiting, and input validation
- 🔒 **Password Security**: bcrypt hashing with configurable salt rounds
- 🗄️ **Database**: PostgreSQL with Drizzle ORM for reliable data management
- ⚡ **Fast Development**: Vite with HMR for instant feedback

## 🏗️ Architecture

This project consists of two main components:

### Backend API (`/` - Root Directory)

- **Framework**: Express.js 5.x with Node.js (ES Modules)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcrypt password hashing
- **Security**: Helmet, CORS, rate limiting, Zod validation
- **Logging**: Pino for structured logging

### Frontend Application (`/FrontEnd/`)

- **Framework**: React 19.x with Vite 7.x
- **Language**: JavaScript (ES Modules)
- **Styling**: Modern CSS3 with responsive design
- **HTTP Client**: Fetch API for backend communication

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### 1. Backend Setup

1. **Clone and setup the backend**:

   ```bash
   git clone <repository-url>
   cd url-shortener
   npm install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials and settings.

3. **Setup database**:

   ```bash
   npm run drizzle:push
   ```

4. **Start the backend**:
   ```bash
   npm run dev
   ```
   Backend will be available at `http://localhost:3000`

### 2. Frontend Setup

1. **Setup the frontend**:

   ```bash
   cd FrontEnd
   npm install
   ```

2. **Start the frontend**:

   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

3. **Configure API URL** (if needed):
   - Open the frontend in your browser
   - Use the "API Base URL" input to change the backend server URL

## 📁 Project Structure

```
url-shortener/
├── 📁 FrontEnd/              # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/    # React components
│   │   ├── 📁 services/      # API service functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Frontend dependencies
│   └── README.md             # Frontend documentation
├── 📁 src/                   # Backend source code
│   ├── 📁 models/            # Database models
│   ├── 📁 routes/            # API routes
│   ├── 📁 services/          # Business logic
│   └── 📁 middleware/        # Express middleware
├── .env.example              # Environment template
├── package.json              # Backend dependencies
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database Configuration
DATABASE_URL=postgres://username:password@localhost:5432/database_name

# Server Settings
PORT=3000
BASE_URL=http://localhost:3000

# JWT Authentication
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=1h

# Security Settings
SALT_ROUNDS=10

# Logging
LOG_LEVEL=info
```

### Development vs Production

**Development**:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Database: Local PostgreSQL instance

**Production**:

- Configure `BASE_URL` to your production domain
- Use production PostgreSQL database
- Set strong `JWT_SECRET`
- Configure appropriate `LOG_LEVEL`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user     | No            |
| POST   | `/api/auth/login`    | Login and get JWT token | No            |

### URL Management Endpoints

| Method | Endpoint            | Description              | Auth Required |
| ------ | ------------------- | ------------------------ | ------------- |
| POST   | `/api/url/shorten`  | Create a short URL       | Yes           |
| GET    | `/api/url/urls`     | Get all user's URLs      | Yes           |
| DELETE | `/api/url/urls/:id` | Delete a specific URL    | Yes           |
| GET    | `/:shortcode`       | Redirect to original URL | No            |

### Usage Flow

1. **Register/Login** → Get JWT token
2. **Shorten URLs** → Create short links with authentication
3. **Manage URLs** → View and delete your URLs
4. **Share Links** → Public access to shortened URLs (no auth required)

### Request/Response Examples

#### Register User

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

**Response (201):**

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Shorten URL

```bash
curl -X POST http://localhost:3000/api/url/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://www.example.com/very/long/url"
  }'
```

**Response (201):**

```json
{
  "message": "URL shortened successfully",
  "shortUrl": "http://localhost:3000/abc123",
  "url": {
    "id": "uuid",
    "shortcode": "abc123",
    "targeturl": "https://www.example.com/very/long/url",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### List User URLs

```bash
curl -X GET http://localhost:3000/api/url/urls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "urls": [
    {
      "id": "uuid",
      "shortcode": "abc123",
      "targeturl": "https://www.example.com/very/long/url",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Delete URL

```bash
curl -X DELETE http://localhost:3000/api/url/urls/YOUR_URL_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**

```json
{
  "message": "URL deleted successfully"
}
```

#### Public Redirect

```bash
curl -L http://localhost:3000/abc123
# Redirects to the original URL
```

## 🧪 API Testing Guide

### Complete curl Commands for Testing

Here are all the curl commands you need to test your URL shortener API:

#### 1. Register a New User

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "SecurePass123!"
  }'
```

#### 2. Login and Get JWT Token

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Alternative login with phone:**

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "password": "SecurePass123!"
  }'
```

#### 3. Shorten a URL (Replace YOUR_JWT_TOKEN)

```bash
curl -i -X POST http://localhost:3000/api/url/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://www.google.com"
  }'
```

#### 4. List All Your URLs

```bash
curl -i -X GET http://localhost:3000/api/url/urls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. Delete a Specific URL (Replace YOUR_URL_ID)

```bash
curl -i -X DELETE http://localhost:3000/api/url/urls/YOUR_URL_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 6. Test Public Redirect (Replace SHORT_CODE)

```bash
curl -L http://localhost:3000/SHORT_CODE
```

### 🔄 Complete Testing Workflow

**Step 1: Register**

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"TestUser","email":"test@example.com","phone":"1234567890","password":"Test123!"}'
```

**Step 2: Login and capture token**

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

_Copy the token from the response_

**Step 3: Shorten URLs (replace TOKEN)**

```bash
# Shorten Google
curl -i -X POST http://localhost:3000/api/url/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"url":"https://www.google.com"}'

# Shorten GitHub
curl -i -X POST http://localhost:3000/api/url/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"url":"https://github.com"}'

# Shorten YouTube
curl -i -X POST http://localhost:3000/api/url/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"url":"https://www.youtube.com"}'
```

**Step 4: List all URLs**

```bash
curl -i -X GET http://localhost:3000/api/url/urls \
  -H "Authorization: Bearer TOKEN"
```

**Step 5: Test redirects (use actual shortcodes from responses)**

```bash
curl -L http://localhost:3000/SHORTCODE1
curl -L http://localhost:3000/SHORTCODE2
curl -L http://localhost:3000/SHORTCODE3
```

**Step 6: Delete a URL (use actual URL ID)**

```bash
curl -i -X DELETE http://localhost:3000/api/url/urls/URL_ID \
  -H "Authorization: Bearer TOKEN"
```

### 🐳 Docker Database Testing

If using the provided `docker-compose.yml`:

**Start PostgreSQL:**

```bash
docker-compose up -d
```

**Update your .env for Docker database:**

```env
DATABASE_URL=postgres://postgres:root@localhost:5433/data
```

**Stop database:**

```bash
docker-compose down
```

### 📋 Expected Response Codes

| Endpoint                 | Success Code | Error Codes |
| ------------------------ | ------------ | ----------- |
| POST /api/auth/register  | 201          | 400, 409    |
| POST /api/auth/login     | 200          | 400, 401    |
| POST /api/url/shorten    | 201          | 400, 401    |
| GET /api/url/urls        | 200          | 401         |
| DELETE /api/url/urls/:id | 200          | 401, 404    |
| GET /:shortcode          | 302          | 404         |

### 🔍 Troubleshooting API Tests

**Common Issues:**

1. **401 Unauthorized**: Check if JWT token is valid and properly formatted
2. **404 Not Found**: Verify endpoint URLs match your route configuration
3. **400 Bad Request**: Check request body format and required fields
4. **409 Conflict**: Email/phone already exists during registration
5. **Connection Refused**: Ensure backend server is running on port 3000

## 🗄️ Database Schema

The application uses PostgreSQL with Drizzle ORM and consists of two main tables with proper indexing for optimal performance.

### Users Table (`users`)

| Column       | Type         | Constraints                   | Description                |
| ------------ | ------------ | ----------------------------- | -------------------------- |
| `id`         | UUID         | PRIMARY KEY, DEFAULT random() | Unique user identifier     |
| `name`       | VARCHAR(255) | NOT NULL                      | User's full name           |
| `email`      | VARCHAR(255) | NOT NULL, UNIQUE              | User's email address       |
| `phone`      | VARCHAR(20)  | NOT NULL, UNIQUE              | User's phone number        |
| `password`   | TEXT         | NOT NULL                      | bcrypt hashed password     |
| `created_at` | TIMESTAMP    | NOT NULL, DEFAULT NOW()       | Account creation timestamp |
| `updated_at` | TIMESTAMP    | NOT NULL, DEFAULT NOW()       | Last update timestamp      |

**Indexes:**

- `users_email_unique` - Unique index on email
- `users_phone_unique` - Unique index on phone
- `users_created_at_index` - Index on created_at for sorting

### URLs Table (`urls`)

| Column       | Type        | Constraints                   | Description                      |
| ------------ | ----------- | ----------------------------- | -------------------------------- |
| `id`         | UUID        | PRIMARY KEY, DEFAULT random() | Unique URL record identifier     |
| `shortcode`  | VARCHAR(64) | NOT NULL, UNIQUE              | Generated short code for URL     |
| `targeturl`  | TEXT        | NOT NULL                      | Original long URL to redirect to |
| `userid`     | UUID        | NOT NULL, FOREIGN KEY         | References users.id              |
| `created_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()       | URL creation timestamp           |
| `updated_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()       | Last update timestamp            |

**Foreign Key Constraints:**

- `userid` → `users.id` (CASCADE on DELETE/UPDATE)

**Indexes:**

- `urls_shortcode_unique` - Unique index on shortcode for fast lookups
- `urls_user_id_index` - Index on userid for user's URL queries
- `urls_created_at_index` - Index on created_at for sorting

### Database Relationships

```
users (1) ──────── (*) urls
  │                   │
  └─ id ──────────── userid
```

- **One-to-Many**: Each user can have multiple shortened URLs
- **Cascade Delete**: When a user is deleted, all their URLs are automatically removed
- **Cascade Update**: User ID updates propagate to related URLs

### Schema Files

The database schema is defined using Drizzle ORM in these files:

- `src/model/user.model.js` - Users table definition
- `src/model/urls.model.js` - URLs table definition
- `drizzle.config.js` - Drizzle configuration
- `drizzle/` - Generated migration files

### Performance Considerations

- **Shortcode Lookups**: Unique index on `shortcode` ensures O(1) redirect performance
- **User URL Queries**: Index on `userid` optimizes fetching user's URLs
- **Chronological Sorting**: Indexes on `created_at` enable efficient time-based queries
- **UUID Primary Keys**: Distributed-friendly identifiers prevent collision issues

## 🛠️ Development

### Backend Scripts (Root Directory)

```bash
# Development
npm run dev              # Start with auto-reload
npm start               # Production server

# Database Management
npm run drizzle:generate # Generate migrations
npm run drizzle:push    # Push schema to database
npm run drizzle:migrate # Run migrations
npm run drizzle:studio  # Open Drizzle Studio
```

### Frontend Scripts (`/FrontEnd/`)

```bash
# Development
npm run dev             # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

### Full Stack Development

1. **Start Backend** (Terminal 1):

   ```bash
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):

   ```bash
   cd FrontEnd
   npm run dev
   ```

3. **Database Management** (Terminal 3):
   ```bash
   npm run drizzle:studio  # Optional: Visual database management
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Rate Limiting**: Prevents abuse and DoS attacks on API endpoints
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet middleware for Express security
- **Input Validation**: Zod schemas for comprehensive request validation
- **SQL Injection Prevention**: Drizzle ORM with parameterized queries
- **XSS Protection**: Proper input sanitization and output encoding

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (in development)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate email/phone)
- `500` - Internal Server Error

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**:

   - Set production environment variables
   - Configure production PostgreSQL database
   - Set strong JWT secret

2. **Database Migration**:

   ```bash
   npm run drizzle:push
   ```

3. **Start Production Server**:
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build for Production**:

   ```bash
   cd FrontEnd
   npm run build
   ```

2. **Deploy Static Files**:
   - Upload `dist/` folder to your static hosting service
   - Configure API base URL for production

### Recommended Hosting

- **Backend**: Railway, Render, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: Railway PostgreSQL, Supabase, AWS RDS

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**:
   - Follow existing code style
   - Add tests if applicable
   - Update documentation
4. **Test your changes**:

   ```bash
   # Backend tests
   npm test

   # Frontend tests
   cd FrontEnd && npm run lint
   ```

5. **Submit a pull request**

### Development Guidelines

- Follow existing code patterns and conventions
- Write clear commit messages
- Update README if adding new features
- Ensure all tests pass before submitting PR

## 📄 License

ISC License

## 🆘 Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Check individual README files in `/` and `/FrontEnd/`
- **API Reference**: See the detailed API documentation above

---

**Made with ❤️ using Express.js, React, and PostgreSQL**
