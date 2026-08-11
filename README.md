# CareerConnect

A production-ready job portal built with Next.js App Router, PostgreSQL, Prisma, NextAuth, and a standalone Socket.IO server for real-time features.

## Project Structure

This project is organized into two main services:

- **[`my-app/`](./my-app)**: The main Next.js web application. It includes the frontend dashboard for employers and candidates, as well as the backend REST API.
- **[`sockets/`](./sockets)**: A standalone Socket.IO Node.js server. This handles real-time bidirectional events (like instant notifications). It is separated from the main app because serverless environments like Vercel do not natively support long-lived WebSocket connections.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6
- **Authentication**: NextAuth v4 (JWT + Credentials)
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

## Getting Started

To run the full stack locally, you will need two terminal windows to run both the Next.js frontend and the Socket.IO server.

### 1. Setting up the Main Web App
Navigate to the `my-app` directory to set up the Next.js application:

```bash
cd my-app
npm install
```
Copy the example environment file and fill in your database credentials and secrets:
```bash
cp .env.example .env
```
Initialize the database and start the server:
```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

For more details on database seeding, API responses, roles, permissions, and Docker setup, see the **[Next.js App README](./my-app/README.md)**.

### 2. Setting up the Sockets Server
In a new terminal window, navigate to the `sockets` directory:

```bash
cd sockets
npm install
```
Create a `.env` file in the `sockets` directory. You will need to provide:
- `NEXTAUTH_SECRET` (Must match the one in `my-app/.env` to decode authentication tokens securely)
- `APP_ORIGIN` (Your frontend URL for CORS, typically `http://localhost:3000` locally)

Start the socket server:
```bash
npm run dev
```

## Deployment Architecture

Because WebSocket connections require a long-running, stateful server, the deployment architecture is split across two platforms:

1. **Frontend & REST API**: Designed to be deployed on **Vercel** (Serverless).
2. **Socket.IO Server**: Designed to be deployed on **Render** (Web Service). A `render.yaml` blueprint is provided in the root directory for easy deployment.

When deploying for production, ensure that both `NEXTAUTH_SECRET` and `SOCKET_RELAY_SECRET` match exactly across your Vercel and Render environments. Update the `APP_ORIGIN` in Render to match your final Vercel production domain.
