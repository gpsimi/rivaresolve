# rivaResolve — Technical Project Report

**Course:** MIT 8333 - Advanced Web Application Development (Virtual Lab)  
**Academic Session:** 2026/2027 Academic Session  
**Continuous Assessment:** 40 Marks  
**Student Name:** Godspower Aghorunse 
**Project Title:** Design and Implementation of rivaResolve: A Web-based Campus Maintenance Portal  

---

## 1. Introduction and Problem Statement
Currently, riva Open University receives maintenance complaints and service requests manually through phone calls, paper forms, WhatsApp messages, and unscheduled office visits. This manual workflow suffers from:
*   **Operational Delays:** Service requests are delayed during transit between reception and technicians.
*   **Missing Records:** Paper slips and chat histories get lost, leaving no reference trail.
*   **Lack of Accountability:** No logging mechanism exists to audit when a fault was reported, who assigned it, and how long resolution took.
*   **Poor Tracking:** Requesters have no way to verify if their issue has been acknowledged or when a technician will arrive.

**rivaResolve** is a full-stack web application designed to digitize this workspace, allowing students/staff to report issues (electrical, plumbing, furniture, IT, classroom, hostel) and enabling administrators to assign and track tickets to conclusion.

---

## 2. System Objectives
The primary objectives of the rivaResolve system are:
1.  **Centralize Reporting:** Build a single digital entry point for students and staff to submit maintenance logs with visual photo evidence.
2.  **Role-Based Auditing:** Establish separate dashboard portals for Requesters (Students/Staff), Technicians (Maintenance Officers), and Administrators.
3.  **Real-Time Stepper Progress Tracking:** Implement a visual timeline tracker showing ticket progression (Submitted $\rightarrow$ Assigned $\rightarrow$ In Progress $\rightarrow$ Resolved).
4.  **Operational Accountability:** Log every status change with timestamps and comments in a dedicated audit trail table.
5.  **Automated Work Distribution:** Facilitate seamless task delegation, enabling administrators to dispatch unassigned tickets directly to available on-duty officers.

---

## 3. Requirement Analysis

### 3.1 Functional Requirements
*   **User Registration & Secure Authentication:** Access controls utilizing JWT sessions stored in secure HttpOnly cookies.
*   **Role-Based Access Control (RBAC):** Middleware checks validating access levels for subfolders.
*   **Fault Reporting Form:** Dropdown categories, textareas for details, and drag-and-drop file uploaders for photo evidence.
*   **Student Ticket Tracker:** Listing of submitted tickets with textual search and status filters.
*   **Admin Dashboard:** Overview statistics, system-wide ticket tables, and task assignment modals.
*   **Officer Workspace:** Assigned ticket list with action triggers to transition statuses to `IN_PROGRESS` or `RESOLVED` with progress commentary.

### 3.2 Non-Functional Requirements
*   **Security:** Cryptographic password hashing (Bcryptjs 12 rounds) and secure cookie flags (`HttpOnly`, `SameSite=Lax`, `Secure`).
*   **Aesthetics:** Modern design system built on custom HSL color palettes, responsive sidebars, hover animations, and light/dark theme variables.
*   **Performance:** React Server Components (RSC) to reduce client bundles, combined with lazy client-side rendering for modals and search overlays.
*   **Reliability:** Prisma database transactions to prevent half-finished assignments or detached status logs during database writes.

---

## 4. Frontend Technologies Used
*   **React 19 & Next.js 16 (App Router):** Core UI engine leveraging Server-Side Rendering (SSR) and Client-Side rendering.
*   **Tailwind CSS v4:** Modern styling framework utilizing direct CSS compilation.
*   **Shadcn UI:** Custom, accessible UI components (Card, Button, Input, Label, Textarea) styled using Tailwind.
*   **Lucide React:** Icon library for dashboard sidebar links and timeline stepper nodes.

---

## 5. Backend Technologies Used
*   **Next.js API Route Handlers:** Serverless REST API endpoints for user registration, sessions, category retrieval, and ticket CRUD actions.
*   **TypeScript:** Type safety throughout API inputs, database models, and React props.
*   **Jose:** JSON Web Signature (JWS) and Token (JWT) compiler optimized for high-performance Next.js routing/middleware contexts.
*   **Bcryptjs:** Secure hashing algorithm for passwords.
*   **Node FS/Promises:** Handles local file uploads, writing images to the `public/uploads` directory.

---

## 6. The Database Used and Types of Relationships
The application uses **PostgreSQL** connected via **Prisma ORM**. The relational schema supports the following entities:

```text
+--------------+          +--------------+          +------------------+
|     Role     | 1      * |     User     | 1      * |  ServiceRequest  |
|--------------|----------|--------------|----------|------------------|
| id (PK)      |          | id (PK)      |          | id (PK)          |
| name         |          | email        |          | title            |
+--------------+          | passwordHash |          | description      |
                          | roleId (FK)  |          | imageUrl         |
                          +--------------+          | status (Enum)    |
                                 |                  | categoryId (FK)  |
                                 | 1                | requesterId (FK) |
                                 |                  +------------------+
                                 |                           |
                                 | 1                         | 1
                                 |                           |
                                 | *                         | *
                          +--------------+          +------------------+
                          |  Assignment  | *      1 |    StatusLog     |
                          |--------------|----------|------------------|
                          | id (PK)      |          | id (PK)          |
                          | requestId(FK)|          | requestId (FK)   |
                          | officerId(FK)|          | status (Enum)    |
                          +--------------+          | updaterId (FK)   |
                                                    | comment          |
                                                    +------------------+
```

### Relationship Summary:
1.  **User to Role (Many-to-One):** Each user has one role (`ADMINISTRATOR`, `MAINTENANCE_OFFICER`, `STUDENT_STAFF`).
2.  **User to ServiceRequest (One-to-Many):** A student user can submit multiple requests.
3.  **ServiceRequest to Category (Many-to-One):** Each request belongs to one category (e.g., Plumbing, Electricity).
4.  **ServiceRequest to Assignment (One-to-Many):** A request can have assignment records (technicians allocated).
5.  **ServiceRequest to StatusLog (One-to-Many):** A request records multiple timeline log history entries as its state changes.
6.  **StatusLog to User (Many-to-One):** Each log update is authored by one updater user.

---

## 7. API Documentation
Detailed API references are documented in the root directory under [API_DOCUMENTATION.md](API_DOCUMENTATION.md). Endpoints include:
*   Auth endpoints (`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`).
*   Requester endpoints (`GET /api/categories`, `POST /api/requests`, `GET /api/requests`, `GET /api/requests/[id]`).
*   Administrator endpoints (`GET /api/admin/requests`, `GET /api/admin/officers`, `POST /api/admin/assign`, `GET /api/admin/users`).
*   Officer endpoints (`GET /api/officer/tasks`, `POST /api/officer/update-status`).

---

## 8. Screenshots of Major Interfaces

*   *Insert Screenshot 1: Custom Landing/Gateway page at http://localhost:3000.*
*   *Insert Screenshot 2: Login card showing validation errors.*
*   *Insert Screenshot 3: Student Portal Dashboard with reported tickets list.*
*   *Insert Screenshot 4: "Report a Fault" form displaying drop-down categories and file attachment preview.*
*   *Insert Screenshot 5: Ticket Tracking Detail View showing the visual stepper timeline (Submitted -> Assigned -> In Progress -> Resolved).*
*   *Insert Screenshot 6: Admin Dashboard showing ticket tables and the "Assign to Officer" modal.*
*   *Insert Screenshot 7: Maintenance Officer workspace showing assigned tasks.*

---

## 9. Testing Evidence
We configured **Vitest** and **React Testing Library** to execute unit tests. 

Running `npm run test` executes both the frontend button component validation, backend cryptographical helpers, and role-based access control session checks successfully:

```text
> rivaresolve@0.1.0 test
> vitest run

 RUN  v4.1.10 C:/Users/Godspower Similoluwa/Documents/GitHub/mivaresolve

 ✓ __tests__/role.test.ts (3 tests) 20ms
 ✓ __tests__/button.test.tsx (2 tests) 234ms
 ✓ __tests__/auth.test.ts (3 tests) 2032ms
     ✓ should successfully hash a plaintext password  531ms
     ✓ should return true when comparing the correct plaintext password with the hash  792ms
     ✓ should return false when comparing an incorrect password with the hash  707ms

 Test Files  3 passed (3)
      Tests  8 passed (8)
   Start at  12:54:58
   Duration  4.95s
```

---

## 10. Deployment Information
*   **Database Hosting:** PostgreSQL provisioned via **Supabase**.
*   **Frontend & API Hosting:** Next.js deployment hosted on **Vercel** with secure environment variables `DATABASE_URL` and `JWT_SECRET`.
*   Detailed build guidelines are outlined in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

---

## 11. Challenges Encountered and Solutions

### Challenge 1: Next.js 16 Deprecation of "middleware.ts"
*   **Problem:** Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`, throwing Turbopack compilation errors if the middleware function was not exported correctly.
*   **Solution:** We moved our routing protection logic to `src/proxy.ts`, changed the function signature to `export default async function proxy(request: NextRequest)`, and updated the matchers. This resolved the static generation checks.

### Challenge 2: Prisma 7 Database Adapter Requirement
*   **Problem:** Prisma 7 removed direct database connection drivers from its core Rust query engine. Running `new PrismaClient()` with an empty constructor threw initialization errors.
*   **Solution:** We configured the Prisma client in `src/lib/db.ts` to use a pg connection pool (`pg.Pool`) and passed it to the `PrismaClient` constructor via the `@prisma/adapter-pg` driver adapter.

### Challenge 3: CSR Bailout on Search Parameters
*   **Problem:** The Next.js compiler failed during static page generation for `/login` because `useSearchParams()` was called without a surrounding `<Suspense>` boundary.
*   **Solution:** We extracted the form logic into `LoginForm` and exported `LoginPage` wrapped inside `<Suspense>` to enable successful static page generation.

### Challenge 4: OpenSSL GCM Stream Cipher Failures on Windows
*   **Problem:** NPM installs failed on Windows with OpenSSL GCM stream decryption handshake errors (`ERR_SSL_CIPHER_OPERATION_FAILED`).
*   **Solution:** We ran the installation utilizing the `$env:NODE_OPTIONS="--openssl-legacy-provider"` environment variable block to bypass the OpenSSL GCM stream cipher bug.

---

## 12. Conclusion
rivaResolve is a robust, full-stack digital solution that successfully resolves the inefficiencies of the university's manual maintenance requests system. By utilizing Next.js 16, Prisma 7, PostgreSQL, and Vitest, the application achieves a clean separation of concerns, strict role-based access control, local upload caching, and a highly responsive, premium user interface. All project requirements have been successfully built, tested, and are ready for deployment.
