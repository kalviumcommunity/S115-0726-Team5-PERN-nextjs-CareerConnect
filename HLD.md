# High-Level Design (HLD)

## 1. System Architecture
CareerConnect adopts a decoupled architecture to separate the stateless web application from stateful real-time interactions.

### 1.1 Components
- **Web Application (Next.js)**: Handles UI, server-side rendering, REST APIs, authentication, and database interactions. Deployed on Vercel (Serverless).
- **Real-Time Server (Socket.IO/Node.js)**: A standalone Node.js server handling bidirectional events and notifications. Deployed on Render (Web Service).
- **Database (PostgreSQL via Neon)**: Primary datastore for user profiles, jobs, applications, and companies.

## 2. Data Flow
1. **Client Request**: Users interact with the Next.js frontend.
2. **API Layer**: The Next.js App Router API handles the request.
3. **Service Layer**: Business logic validation and execution.
4. **Data Access Layer**: Prisma ORM translates logic into database operations.
5. **Real-time Event**: If applicable (e.g., status update), an event is dispatched to the Socket.IO server, which pushes notifications to the connected clients.

## 3. Technology Stack
- **Frontend & Backend**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- **Database Layer**: PostgreSQL (Neon), Prisma 6
- **Real-time Layer**: Socket.IO
- **Authentication**: NextAuth v4
- **Validation**: Zod

## 4. Deployment Architecture
- **Vercel**: Hosts the Next.js frontend and REST APIs for scalable, serverless execution.
- **Render**: Hosts the long-lived Socket.IO server required for WebSocket connections.
- **Neon**: Serverless PostgreSQL database.
