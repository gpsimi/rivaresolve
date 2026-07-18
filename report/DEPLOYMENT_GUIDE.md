# rivaResolve — Deployment & Setup Guide

This guide details the step-by-step instructions to provision the PostgreSQL database on Supabase, run migrations/seed scripts, and host the full-stack Next.js application live on Vercel.

---

## 1. Supabase Database Setup

To fulfill the **Section C: Database Integration** requirements, you need a hosted PostgreSQL database. We recommend using **Supabase** due to its free tier and direct connection support.

1.  **Create a Project:**
    *   Sign up or log in at [supabase.com](https://supabase.com).
    *   Click **New Project** and select your organization.
    *   Enter a project name (e.g., `rivaresolve`).
    *   Set a secure database password (save this, you will need it later).
    *   Select a hosting region close to you and click **Create new project**.
2.  **Retrieve Connection URI:**
    *   Once your project is provisioned (takes 1-2 minutes), go to **Project Settings** (gear icon in the sidebar) $\rightarrow$ **Database**.
    *   Scroll down to the **Connection string** section.
    *   Select the **URI** tab.
    *   Copy the string. It will look like this:
        ```text
        postgresql://postgres.[your-project-id]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
        ```
    *   Replace `[your-password]` with the actual database password you chose during project creation.

---

## 2. Local Database Synchronization & Seeding

Now, sync the database tables and pre-populate them with the default configuration data.

1.  **Configure Environment File:**
    *   Open the [.env](.env) file in the root directory of your project.
    *   Paste your connection URI on line 12:
        ```env
        DATABASE_URL="postgresql://postgres.[your-project-id]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        ```
2.  **Push Database Schema:**
    *   Open your terminal in the project directory.
    *   Sync your local Prisma schema to the Supabase database. This will automatically create all tables (`User`, `Role`, `Category`, `ServiceRequest`, etc.):
        ```bash
        npx prisma db push
        ```
3.  **Seed Database Mock Data:**
    *   Run the seed script to populate the database with default roles, categories, and test user accounts:
        ```bash
        npx prisma db seed
        ```
    *   *Seeded Accounts for Testing:*
        *   **Student:** `student@riva.edu.ng` (Password: `Password123`)
        *   **Maintenance Officer:** `officer@riva.edu.ng` (Password: `Password123`)
        *   **Administrator:** `admin@riva.edu.ng` (Password: `Password123`)

---

## 3. Vercel Hosting Setup

Deploy the application frontend and edge API server routes to Vercel.

1.  **Push to GitHub:**
    *   Commit all your files and push them to a private or public GitHub repository.
2.  **Deploy on Vercel:**
    *   Sign up or log in at [vercel.com](https://vercel.com).
    *   Click **Add New** $\rightarrow$ **Project**.
    *   Import your `rivaresolve` repository.
3.  **Configure Environment Variables:**
    *   Expand the **Environment Variables** section.
    *   Add the following keys:
        *   `DATABASE_URL`: (Paste your copied Supabase connection URI).
        *   `JWT_SECRET`: (Enter a long, random passphrase of your choice to sign secure session tokens).
4.  **Launch Deployment:**
    *   Click **Deploy**.
    *   Vercel will install dependencies, compile TypeScript, run Next.js Turbopack build checks, and deploy your site live!
    *   Once complete, open your deployed domain link and test the landing and dashboard panels.
