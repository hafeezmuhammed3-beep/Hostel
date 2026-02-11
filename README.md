# Hostel Management Application

A complete solution for managing hostel operations, including rooms, tenants, rent tracking, and expenses.

## Features

- **Dashboard**: Consolidated view of occupancy and financials.
- **Room Management**: Manage rooms and bed allocation.
- **Tenant Management**: Onboard tenants and track their details.
- **Rent Tracker**: Monthly rent payment recording and status tracking.
- **Expense Management**: Log and categorize operational expenses.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (via Prisma)
- **Styling**: Tailwind CSS & shadcn/ui

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app`: App Router pages and API routes.
- `src/components`: UI components (feature-based).
- `src/lib`: Utilities and Prisma client.
- `prisma`: Database schema and migrations.
