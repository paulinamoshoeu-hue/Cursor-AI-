# Estate Complaint Management System

A full-stack web application for managing estate complaints with role-based access control.

## Features

### Resident Features
- Register and login securely
- Submit new complaints with title and description
- View complaint history with status tracking
- See admin feedback and comments

### Admin Features
- Secure admin login
- View all complaints with filtering by status
- Update complaint status (New, Pending, Resolved)
- Provide feedback and comments
- Dashboard with complaint summary

## Quick Start

### Option 1: Simple HTML Demo (No Node.js required)
1. Start the backend server:
   ```bash
   start-backend.bat
   ```
2. Open `simple-app.html` in your browser
3. Use demo accounts:
   - Admin: admin@estate.com / admin123
   - Resident: resident@estate.com / resident123

### Option 2: Full React App (Requires Node.js)
1. Install Node.js LTS from https://nodejs.org
2. Start backend:
   ```bash
   start-backend.bat
   ```
3. Start frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## API Endpoints

- Health: GET http://localhost:4000/health
- Register: POST http://localhost:4000/api/auth/register
- Login: POST http://localhost:4000/api/auth/login
- Complaints: GET/POST http://localhost:4000/api/complaints
- Admin: GET http://localhost:4000/api/admin/complaints
- Update Status: PATCH http://localhost:4000/api/admin/complaints/:id/status

## Database

Uses SQLite with Prisma ORM. Database file: `backend/dev.db`

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, SQLite
- Frontend: React, TypeScript, Vite
- Authentication: JWT
- File Uploads: Multer
