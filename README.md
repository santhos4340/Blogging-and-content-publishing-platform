# Blogging Content and Publishing Platform

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Spring%20Boot%20%7C%20Supabase-blue)](#technology-stack)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20RLS-emerald)](#database--security-architecture)

A modern full-stack content publishing platform built as a final-year capstone project featuring a **React (JavaScript)** frontend, **Java Spring Boot (Maven)** REST API backend, and **Supabase PostgreSQL** with Row Level Security (RLS) policies.

---

## Architecture Overview

```
Blogging and content/
├── frontend/             # React + Vite application with Supabase Auth & Axios
├── backend/              # Java 17+ Spring Boot Maven service with Layered Architecture
└── supabase/
    └── schema.sql        # Database schema, table definitions, seed data, & RLS policies
```

---

## Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM (v6)
- **Authentication**: `@supabase/supabase-js` Auth listener & session persistence
- **HTTP Client**: Axios with Bearer token interceptor
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design Tokens with glassmorphism & responsive layout system

### Backend
- **Framework**: Java 17, Spring Boot 3.2
- **Build Tool**: Apache Maven
- **Database Access**: Spring Data JPA & Hibernate
- **Validation**: Spring Boot Starter Validation
- **Architecture**: Layered (`Controller` -> `Service` -> `Repository` -> `Entity` -> `DTO`)
- **Cors Config**: Custom `CorsConfig` allowing cross-origin requests from React

### Database & Auth
- **Database**: Supabase PostgreSQL
- **Security**: Row Level Security (RLS) policies on `profiles`, `blogs`, `categories`, `blog_categories`, and `comments`

---

## Database & Security Architecture

The platform enforces data security at both the application level and directly inside PostgreSQL using **Row Level Security (RLS)** policies:

| Table | Access Level | Description |
| :--- | :--- | :--- |
| **`profiles`** | Authenticated / Public Read | Users can insert & update only their own profile (`auth.uid() = user_id`) |
| **`blogs`** | Selective | Public users can read `PUBLISHED` posts. Authors have full CRUD access to their own drafts & published posts |
| **`categories`** | Public Read | Standard categories accessible by all readers |
| **`comments`** | selective | Public read on published posts. Authenticated users can post and manage their own comments |

---

## Features & Pages Built

1. **Landing / Home Page (`/`)**: Hero section, featured articles grid, category pills, call-to-action banner.
2. **User Authentication (`/register`, `/login`)**:
   - Registration with full field validation & profile record auto-creation.
   - Login with password visibility toggle, session persistence, and error handling.
3. **Protected Author Dashboard (`/dashboard`)**: Analytics counters (Total, Published, Drafts), profile status badge, quick actions, recent articles.
4. **Article Writer (`/create-blog`)**: Rich input editor with real-time URL slug auto-generation, category selection, draft/publish options.
5. **Article Editor (`/edit-blog/:id`)**: Edit existing posts with update and deletion controls.
6. **Article Viewer (`/blogs/:id`)**: Clean article reader view with metadata, tags, author bio, and interactive comment section.
7. **My Articles (`/my-blogs`)**: Filterable grid of published vs draft posts with view/edit/delete actions.
8. **Profile Manager (`/profile`)**: Manage user avatar URL, author bio, and display name.

---

## API Endpoints Reference

### Health Check
- `GET /api/health` — Verifies Spring Boot REST API operational status.

### User Profile
- `GET /api/users/me` — Fetches current user profile.
- `PUT /api/users/me` — Updates current user profile details.

### Blogs REST API
- `GET /api/blogs` — Returns published blog articles.
- `GET /api/blogs/{id}` — Returns blog details by ID.
- `POST /api/blogs` — Creates a new blog article (Draft / Published).
- `PUT /api/blogs/{id}` — Updates an existing blog article.
- `DELETE /api/blogs/{id}` — Removes an article by ID.

### Categories
- `GET /api/categories` — Returns available categories.

### Comments REST API
- `GET /api/blogs/{blogId}/comments` — Fetches article comments.
- `POST /api/blogs/{blogId}/comments` — Submits a comment on an article.

---

## Getting Started

### 1. Database Setup
Execute the contents of [`supabase/schema.sql`](file:///c:/Users/Admin/Desktop/Blogging%20and%20content/supabase/schema.sql) in your Supabase project's **SQL Editor**.

### 2. Frontend Configuration & Execution
Create a `.env` file inside `/frontend`:
```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:8080/api
```
Run the development server:
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Configuration & Execution
Provide database environment variables:
```bash
export SUPABASE_DATABASE_URL=jdbc:postgresql://your-db-host:5432/postgres
export SUPABASE_DATABASE_USERNAME=postgres
export SUPABASE_DATABASE_PASSWORD=your-password
```
Run the Spring Boot application:
```bash
cd backend
mvn spring-boot:run
```
