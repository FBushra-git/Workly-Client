# Workly Freelance Marketplace

A modular REST API for a Fiverr/Upwork-style marketplace. Clients order freelancer services, freelancers manage gigs and delivery status, and clients review completed work. The API uses soft deletion for business records and role-scoped access for private data.

## 1. Project Overview

The backend provides authentication, user profiles, categories, services, orders, and reviews. It is designed for a separate React or Next.js frontend communicating only through HTTP.

The client is built with Next.js, React, TypeScript, Tailwind CSS, and Lucide icons. Configure `NEXT_PUBLIC_API_URL=http://localhost:5000`, run `npm install` and `npm run dev`, then open `http://localhost:3000`. Client routes cover marketplace browsing, authentication, service details, and role-specific dashboards. Additional client commands are documented in [CLIENT_SETUP.md](./CLIENT_SETUP.md).

```text
Frontend
   |
REST API
   |
Express + TypeScript
   |
Routes -> Middleware -> Controllers -> Services
   |
Prisma ORM
   |
PostgreSQL
```

## 2. Tech Stack

- Node.js, Express 5, TypeScript
- PostgreSQL, Prisma ORM, Prisma PostgreSQL adapter
- JWT authentication, bcrypt password hashing
- Zod request validation
- dotenv environment loading and CORS

## 3. Project Structure

```text
backend/
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- src/
|   |-- config/          Environment configuration
|   |-- generated/       Generated Prisma Client (ignored)
|   |-- lib/             Reusable Prisma Client
|   |-- middlewares/     Authentication, roles, validation, errors
|   |-- modules/         Controllers, services, and validation by domain
|   |-- routes/          Express route declarations
|   |-- types/           Shared and Express request types
|   |-- utils/           JWT and application error utilities
|   |-- app.ts
|   `-- server.ts
|-- tests/               PostgreSQL integration tests
|-- .env.example
|-- package.json
`-- tsconfig.json
```

## 4. Environment Variables

Create `.env` from `.env.example` and configure:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=verify-full
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

`FRONTEND_URL` accepts comma-separated origins when multiple frontends are allowed. Do not commit `.env`.

Generate a JWT secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 5. Installation

```bash
npm install
npm run prisma:generate
npm run build
npm run dev
```

Development API: `http://localhost:5000`

Production startup uses compiled JavaScript:

```bash
npm run build
npm start
```

## 6. Database Setup

Configure `DATABASE_URL`, then run:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name migration_name
npm run prisma:studio
```

For an existing production database, apply committed migrations with:

```bash
npm run prisma:deploy
```

Models: `User`, `Category`, `Service`, `Order`, and `Review`. IDs are UUIDs. Models use mapped table names, timestamps, relationships, indexes, enums, and `isDeleted` soft-delete flags.

## 7. Authentication

Protected endpoints require:

```http
Authorization: Bearer JWT_TOKEN
```

JWTs contain the user ID, email, and role. Middleware verifies the token and confirms the account still exists and is not deleted. Passwords are hashed with bcrypt using 12 salt rounds and are never included in API responses.

Public registration accepts only `CLIENT` and `FREELANCER`. Bootstrap the first `ADMIN` through a controlled database operation, such as changing a development account's role in Prisma Studio. Production administration should use a restricted operational process.

## 8. API Endpoints

All errors use:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

Common status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, and `500`.

### Health

| Method | URL | Authentication | Description | Status |
|---|---|---|---|---|
| GET | `/` | Public | API availability | 200 |
| GET | `/api/health` | Public | Environment and uptime health check | 200 |

```json
{ "success": true, "message": "Freelance Marketplace API is running", "data": null }
```

### Authentication

| Method | URL | Authentication | Body | Status |
|---|---|---|---|---|
| POST | `/api/auth/register` | Public | `name`, `email`, `password`, `role` | 201, 400, 409 |
| POST | `/api/auth/login` | Public | `email`, `password` | 200, 400, 401 |

Register:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CLIENT"
}
```

Registration response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": { "user": { "id": "UUID", "name": "John Doe", "email": "john@example.com", "role": "CLIENT" } }
}
```

Login response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "JWT_TOKEN", "user": { "id": "UUID", "email": "john@example.com", "role": "CLIENT" } }
}
```

### Users

| Method | URL | Authentication / Role | Body | Status |
|---|---|---|---|---|
| GET | `/api/users/me` | Authenticated | None | 200, 401 |
| PATCH | `/api/users/me` | Authenticated | `name?`, `profileImage?`, `bio?` | 200, 400, 401 |
| GET | `/api/users` | ADMIN | None | 200, 401, 403 |
| GET | `/api/users/:id` | Authenticated | UUID path parameter | 200, 400, 401, 404 |
| PATCH | `/api/users/:id` | ADMIN | Profile fields and/or `role` | 200, 400, 401, 403, 404 |
| DELETE | `/api/users/:id` | ADMIN | None; soft delete | 200, 400, 401, 403, 404 |

Profile update:

```json
{ "name": "John Smith", "bio": "Frontend developer" }
```

User response:

```json
{ "success": true, "message": "User retrieved successfully", "data": { "user": { "id": "UUID", "name": "John Smith", "role": "CLIENT" } } }
```

### Categories

| Method | URL | Authentication / Role | Body | Status |
|---|---|---|---|---|
| POST | `/api/categories` | ADMIN | `name`, `description?` | 201, 400, 401, 403, 409 |
| GET | `/api/categories` | Public | None | 200 |
| GET | `/api/categories/:id` | Public | UUID path parameter | 200, 400, 404 |
| PATCH | `/api/categories/:id` | ADMIN | `name?`, `description?` | 200, 400, 401, 403, 404, 409 |
| DELETE | `/api/categories/:id` | ADMIN | None; soft delete | 200, 400, 401, 403, 404 |

```json
{ "name": "Web Development", "description": "Website and application development" }
```

```json
{ "success": true, "message": "Category created successfully", "data": { "category": { "id": "UUID", "name": "Web Development" } } }
```

List response:

```json
{ "success": true, "message": "Categories retrieved successfully", "data": [] }
```

### Services

| Method | URL | Authentication / Role | Body or Query | Status |
|---|---|---|---|---|
| POST | `/api/services` | FREELANCER | Service body | 201, 400, 401, 403, 404 |
| GET | `/api/services` | Public | `search?`, `categoryId?`, `status?`, `page?`, `limit?` | 200, 400 |
| GET | `/api/services/:id` | Public | UUID path parameter | 200, 400, 404 |
| PATCH | `/api/services/:id` | Owner or ADMIN | Partial service body | 200, 400, 401, 403, 404 |
| DELETE | `/api/services/:id` | Owner or ADMIN | None; soft delete | 200, 400, 401, 403, 404 |

```json
{
  "title": "I will build a modern React website",
  "description": "I will create a responsive and accessible React website.",
  "price": 150,
  "deliveryDays": 7,
  "categoryId": "CATEGORY_UUID"
}
```

Search and pagination example:

```text
GET /api/services?search=react&categoryId=CATEGORY_UUID&status=ACTIVE&page=1&limit=10
```

```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

Service detail and mutation responses use `data.service` and include safe freelancer and category relations.

### Orders

| Method | URL | Authentication / Role | Body | Status |
|---|---|---|---|---|
| POST | `/api/orders` | CLIENT | `serviceId`, `requirements?` | 201, 400, 401, 403, 404 |
| GET | `/api/orders` | Authenticated | Role-scoped list | 200, 401 |
| GET | `/api/orders/:id` | Authorized participant or ADMIN | UUID path parameter | 200, 400, 401, 404 |
| PATCH | `/api/orders/:id` | CLIENT, service owner, or ADMIN | `status` | 200, 400, 401, 404 |
| DELETE | `/api/orders/:id` | Order client or ADMIN | None; soft delete | 200, 400, 401, 403, 404 |

```json
{ "serviceId": "SERVICE_UUID", "requirements": "I need a responsive company website." }
```

```json
{ "status": "IN_PROGRESS" }
```

```json
{ "success": true, "message": "Order created successfully", "data": { "order": { "id": "UUID", "status": "PENDING" } } }
```

Order price is always copied from the service record. Client lists contain their orders, freelancer lists contain orders for their services, and admins see all active orders.

### Reviews

| Method | URL | Authentication / Role | Body or Query | Status |
|---|---|---|---|---|
| POST | `/api/reviews` | CLIENT | `serviceId`, `rating`, `comment?` | 201, 400, 401, 403, 404, 409 |
| GET | `/api/reviews` | Public | `serviceId?` | 200, 400 |
| GET | `/api/reviews/:id` | Public | UUID path parameter | 200, 400, 404 |
| PATCH | `/api/reviews/:id` | Owner or ADMIN | `rating?`, `comment?` | 200, 400, 401, 403, 404 |
| DELETE | `/api/reviews/:id` | Owner or ADMIN | None; soft delete | 200, 400, 401, 403, 404 |

```json
{ "serviceId": "SERVICE_UUID", "rating": 5, "comment": "Excellent work!" }
```

```json
{ "success": true, "message": "Review created successfully", "data": { "review": { "id": "UUID", "rating": 5 } } }
```

A client needs a non-deleted completed order for the service and may have only one active review per service.

## 9. Roles and Permissions

| Capability | CLIENT | FREELANCER | ADMIN |
|---|---:|---:|---:|
| Browse categories, services, reviews | Yes | Yes | Yes |
| Manage own profile | Yes | Yes | Yes |
| Create and manage own services | No | Yes | All services |
| Create and view own orders | Yes | No | All orders |
| View received orders | No | Yes | Yes |
| Update delivery status | Cancel pending | Progress own work | Any valid status |
| Review completed services | Yes | No | Manage reviews |
| Manage categories and users | No | No | Yes |

Order transitions:

```text
CLIENT:     PENDING -> CANCELLED
FREELANCER: PENDING -> IN_PROGRESS -> COMPLETED
ADMIN:      Any different valid status
```

## 10. Frontend Integration

Set the frontend API URL to the deployed backend URL, not the database URL:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const response = await fetch(`${API_URL}/api/services?page=1&limit=10`);
const result = await response.json();
```

Authenticated request:

```ts
const response = await fetch(`${API_URL}/api/orders`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    serviceId,
    requirements: "I need a responsive website.",
  }),
});
```

The browser origin must be listed in backend `FRONTEND_URL`. Store tokens according to the frontend's security model and never expose `DATABASE_URL` or `JWT_SECRET` to browser code.

## 11. Testing

```bash
npm run typecheck
npm run build
npm test
npm run test:auth
npm run test:user
npm run test:category
npm run test:service
npm run test:phase6
npx prisma validate
```

The integration suites use the configured PostgreSQL database and clean up their isolated fixtures. Use a dedicated test database for CI or shared environments.

## 12. Deployment

1. Provision PostgreSQL and obtain its connection URL.
2. Configure `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `FRONTEND_URL`, and `NODE_ENV=production` on the hosting platform.
3. Install dependencies and run `npm run prisma:generate`.
4. Apply committed migrations with `npm run prisma:deploy`.
5. Compile with `npm run build`.
6. Start with `npm start`.
7. Verify `GET /` and the database-backed endpoints.

Do not use `prisma migrate dev` in production. The hosting platform must support the configured Node.js version and outbound PostgreSQL connections.

## Project URLs

```text
Backend API URL: <configure after deployment>
GitHub Repository: <configure after repository publication>
API Documentation: README.md
Frontend URL: <configure when the frontend is available>
```
