# rivaResolve

rivaResolve is a campus maintenance portal built for RIVA Open University. I built this to replace the manual, paper-based workflow for reporting faults on campus (like broken furniture, plumbing issues, or electrical faults). It digitizes the entire process so students can report issues, and admins can assign them to maintenance officers while tracking the resolution progress.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS v4, Shadcn UI
- **Backend:** Next.js Route Handlers, JSON Web Tokens (JWT) for session management
- **Database:** PostgreSQL via Supabase, queried with Prisma ORM

## Live Demo & Access
If you're testing the application, I've seeded the database with a few default accounts so you don't have to register from scratch to see the different dashboards.

Here are the test credentials:

**1. System Administrator** (Can see all tickets and assign them)
- **Email:** admin@riva.edu.ng
- **Password:** Password123
- **ID:** RIVA-ADM-001

**2. Maintenance Officer** (Can see assigned tasks and update their status)
- **Email:** officer@riva.edu.ng
- **Password:** Password123
- **ID:** RIVA-OFF-001

**3. Student** (Can submit new fault reports and track their status)
- **Email:** student@riva.edu.ng
- **Password:** Password123
- **ID:** RIVA-STU-001

## Running Locally

If you want to spin this up on your local machine:

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env` file with your database URL and JWT secret:
   ```env
   DATABASE_URL="your_postgresql_url"
   JWT_SECRET="your_secret_key"
   ```

3. Push the schema to your database and seed the default users:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` to view it in the browser.
