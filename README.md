<!-- Project Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232A" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-State-764ABC?logo=redux&logoColor=white&labelColor=2C2C2C" />
  <img src="https://img.shields.io/badge/NestJS-GraphQL-E0234E?logo=nestjs&logoColor=white&labelColor=1E1E1E" />
  <img src="https://img.shields.io/badge/TypeORM-ORM-FF6F00?labelColor=2C2C2C" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white&labelColor=1E2A3A" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--time-010101?logo=socket.io&logoColor=white&labelColor=2C2C2C" />
  <img src="https://img.shields.io/badge/Toxicity_Blocking-NLP-orange?labelColor=2C2C2C" />
</p>

<h1 align="center">🎬 CineStream</h1>
<p align="center"><i>A Netflix-inspired full-stack movie platform with reviews, watchlists, admin dashboard, and optional toxicity blocking.</i></p>

---

## 📖 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Monorepo Structure](#-monorepo-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install & Run (Two Terminals)](#install--run-two-terminals)
- [GraphQL API](#-graphql-api)
  - [Playground](#playground)
  - [Example Queries & Mutations](#example-queries--mutations)
- [Database (Overview)](#-database-overview)
- [Auth & Roles](#-auth--roles)
- [Ratings](#-ratings)
- [Common Tasks](#-common-tasks)

---

## 🧠 About
**CineStream** is a full-stack web application for discovering, saving, and reviewing movies.

It includes:
- Viewer features (browse catalog, watchlist, reviews/ratings)
- Admin features (movie management, moderation tools)
- Optional **toxicity blocking** for reviews (and chat if enabled)

**Roles**
- **Viewer:** browse movies, manage watchlist, submit reviews/ratings.
- **Admin:** access `/admin` dashboard to manage data and moderate content.

> ✅ Admin access is based on `user.role === "admin"`.

---

## ✨ Features
- 🔐 Authentication – JWT login + session persistence
- 🧑‍💻 Role-based access – Admin dashboard protected
- 🎞️ Movies Catalog – posters, trailers, runtime, year
- 🏷️ Genres – relations between `movies` and `genres`
- 📌 Watchlist – add/remove movies
- ⭐ Reviews & Ratings – 1–5 stars + text review
- 🛡️ Optional toxicity blocking – backend can reject toxic reviews
- 🛠️ Admin Panel – manage Movies / Users / Reviews

---

## 🛠 Tech Stack
**Frontend**
- React (CRA / react-scripts)
- Redux Toolkit
- Tailwind CSS
- Axios (GraphQL client)

**Backend**
- NestJS
- GraphQL (code-first)
- TypeORM

**Database**
- PostgreSQL

**Optional**
- Socket.IO
- Toxicity detection (review/chat moderation)

---

## 🗂 Monorepo Structure
```txt
.
├─ backend/            # NestJS backend (GraphQL + TypeORM)
├─ frontendd/          # React app (Redux Toolkit)
├─ README.md
└─ package.json        # (optional root scripts)


---

## 🚀 Getting Started

### Prerequisites

* Node.js ≥ 18
* PostgreSQL ≥ 15
* npm ≥ 9

### Environment Variables

**api/.env**

```env
# Server
PORT=4000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=cinestream

# JWT (if used)
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=7d

# CORS (if configured)
CORS_ORIGIN=http://localhost:5173
```

**frontend/.env**

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Install & Run (Two Terminals)

**Terminal 1 — Backend**

```bash
cd api
npm i
npm run start:dev
# Backend: http://localhost:4000/graphql
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm i
npm run dev
# Frontend: http://localhost:5173
```

---

## 🔌 GraphQL API

### Playground

* Open: `http://localhost:4000/graphql`

### Example Queries & Mutations

#### ✅ Login

```graphql
mutation Login($email: String!, $password: String!) {
  login(loginInput: { email: $email, password: $password }) {
    token
    user {
      id
      email
      role
    }
  }
}
```

Variables:

```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

#### ✅ Get Movies

```graphql
query {
  movies {
    id
    title
    description
    poster_path
    trailer_path
    release_year
    duration
    genre {
      id
      name
    }
  }
}
```

#### ✅ Get Single Movie

```graphql
query ($id: Int!) {
  movie(id: $id) {
    id
    title
    description
    poster_path
    trailer_path
    release_year
    duration
    genre {
      id
      name
    }
    reviews {
      id
      rating
      review_text
      created_at
      user {
        id
        email
      }
    }
  }
}
```

Variables:

```json
{ "id": 1 }
```

#### ✅ Create Review

```graphql
mutation ($createReviewInput: CreateReviewInput!) {
  createReview(createReviewInput: $createReviewInput) {
    id
    movie_id
    profile_id
    rating
    review_text
    created_at
  }
}
```

Variables:

```json
{
  "createReviewInput": {
    "movie_id": 1,
    "profile_id": 2,
    "rating": 5,
    "review_text": "Great movie!"
  }
}
```

#### ✅ Delete Review

```graphql
mutation ($id: Int!) {
  deleteReview(id: $id)
}
```

Variables:

```json
{ "id": 10 }
```

---

## 🗄 Database Overview

Typical tables (depending on your implementation):

* `users` (id, email, password_hash, role, ...)
* `genres` (id, name)
* `movies` (id, title, description, genre_id, poster_path, trailer_path, release_year, duration, created_at)
* `reviews` (id, movie_id, profile_id, rating, review_text, created_at)
* `watchlist` (id, profile_id, movie_id, ...)

---

## 🔐 Auth & Roles

* After login, backend returns `{ token, user }`
* Admin routing uses `user.role`:

  * Admin: `role === "admin"` → `/admin`
  * Viewer: anything else → `/`

> ⚠️ If you see: `Cannot query field "is_admin" on type "User"`
> Remove `is_admin` from your frontend queries and use `role` only.

---

## ⭐ Ratings

### What you see in the UI

* Movie cards and details display a rating like **4.2 (12)**.

### How it is calculated

You have two options:

✅ **Option A (Backend computed fields — best)**

* Add `average_rating` and `total_ratings` to the `Movie` GraphQL type using a resolver that aggregates reviews in SQL.
* Fast and clean.

✅ **Option B (Frontend fallback — works now)**

* Fetch `movie.reviews { rating }` and compute average in React.
* Works, but heavier when movie lists get large.

---

## 🧰 Common Tasks

### Remove node_modules from Git

```bash
git rm -r --cached node_modules api/node_modules frontend/node_modules
echo -e "node_modules/\napi/node_modules/\nfrontend/node_modules/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore node_modules"
git push origin main
```

### Verify GraphQL schema has your fields

```graphql
query {
  __type(name: "User") {
    fields { name }
  }
}

```

---

## 🗺 Roadmap

* [ ] Add backend `average_rating` + `total_ratings` to Movie
* [ ] One review per user per movie (optional uniqueness)
* [ ] Add real-time chat rooms (Socket.IO)
* [ ] Add toxicity detection in chat + admin moderation queue
* [ ] Add recommendations (content + collaborative)

---

## 📄 License

Educational / portfolio project. Add an MIT LICENSE if publishing publicly.

---

