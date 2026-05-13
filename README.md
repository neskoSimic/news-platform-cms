# News Platform

A full-stack online news platform built with Node.js and React. consists of two parts:
a content management system (CMS) for editors and admins, and a public-facing
news reader with comments, likes, and tag-based filtering.

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js
- **Database:** PostgreSQL (via Docker)

## Features

### CMS (authenticated)

- JWT authentication with two roles: content creator and admin
- Create, edit, and delete news articles with categories and tags
- Full-text search across article titles and content
- Admin can manage users (add, edit, activate/deactivate)
- Passwords stored as hashed values

### Public reader

- Browse latest and most-read articles (last 30 days)
- Filter by category or tag
- Full-text search with pagination
- Comments with likes/dislikes (session-based, no login required)
- Article like/dislike (session-based)
- View count tracking per unique session
- "Read more" section with related articles by shared tags
- Sidebar with top 3 most-reacted articles on every page

## Getting Started

1. Start the database:

```bash
   docker compose up -d
```

2. Start the backend:

```bash
   cd backend
   npm install
   npm run dev
```

3. Start the frontend:

```bash
   cd frontend
   npm install
   npm run dev
```

Set environment variables in `backend/.env`:

## Default Admin

Seed the initial admin account directly into the database before first use.
