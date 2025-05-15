# ACM Admin & Agent Panel

This project is an admin and agent panel built with Next.js, MongoDB, and JWT authentication. It includes user authentication, agent management, lead assignment, and secure session handling.

---

## Features

### 1. User Login

- Secure login form with email and password.
- User authentication using JWT tokens stored in cookies.
- Redirects on login success/failure.
- Protected routes accessible only to logged-in users.

### 2. Agent Management

- Add new agents with full name, email, phone number (with country code), and password.
- Validation to ensure unique email and phone numbers.

### 3. CSV/XLSX Upload and Lead Distribution

- Upload lead files in `.csv`, `.xlsx`, or `.xls` formats.
- Validate file format and data structure.
- Distribute leads evenly among 5 agents.
- Save and track assigned leads in MongoDB.
- Display leads assigned to each agent on the frontend.

---

## Tech Stack

- Next.js (App Router)
- MongoDB with Mongoose
- JWT for authentication
- React hooks and components
- Tailwind CSS for styling
- Lucide React icons

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone  https://github.com/KaranBhosale8585/Assignment.git
cd <your-repo-folder>
npm install

## Getting Started

First, run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
