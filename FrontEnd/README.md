# Simple URL Shortener Frontend

A simple, clean React frontend for the URL Shortener application.

## Features

- **User Authentication** - Login and register with email/phone
- **URL Shortening** - Convert long URLs to short ones
- **URL Management** - View and delete your shortened URLs
- **Copy to Clipboard** - Easy copying of shortened URLs
- **Responsive Design** - Works on desktop and mobile

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   http://localhost:5173

## Backend Setup

Make sure your backend API is running on `http://localhost:3000` with these endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/url/shorten` - Shorten URL
- `GET /api/url/urls` - Get user's URLs
- `DELETE /api/url/urls/:id` - Delete URL

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # All styles
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## How to Use

1. **Register/Login** - Create an account or sign in
2. **Configure API** - Set your backend URL (default: localhost:3000)
3. **Shorten URLs** - Paste long URLs and get short ones
4. **Manage URLs** - View, copy, and delete your shortened URLs

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Tech Stack

- React 18
- Vite
- CSS3
- Fetch API
- Local Storage

Simple and straightforward! 🚀