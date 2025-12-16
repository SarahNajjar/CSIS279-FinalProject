<!-- Project Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232A" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&labelColor=2C2C2C" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white&labelColor=1E2A3A" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--time-010101?logo=socket.io&logoColor=white&labelColor=2C2C2C" />
  <img src="https://img.shields.io/badge/TensorFlow/BERT-AI-orange?labelColor=2C2C2C" />
</p>

<h1 align="center">🎬 CineStream</h1>
<p align="center"><i>An intelligent, social movie platform with real-time chat, AI recommendations, and toxicity detection.</i></p>

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
- [Database Schema (Overview)](#-database-schema-overview)
- [Core API Endpoints](#-core-api-endpoints)
- [Roadmap / Timeline](#-roadmap--timeline)
- [Common Tasks](#-common-tasks)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 About
**CineStream** is a Netflix-inspired full-stack web app for discovering, rating, and discussing movies.  
Beyond classic features (watchlists, favorites, reviews), CineStream adds:
- **Real-time movie chatrooms** (Socket.IO)
- **AI-powered recommendations** (hybrid content + collaborative filtering)
- **Toxicity detection** in chat & reviews (BERT/Detoxify-style models)

**Roles**
- **Viewers:** browse the catalog, manage watchlist/favorites, review & chat.
- **Admins:** manage movies, genres, users; moderate reviews and chats.

---

## ✨ Features
- 🔐 **Auth & Roles** – Viewer/Admin with protected routes.
- 👤 **Profiles** – Multiple profiles per account (like Netflix).
- 🎞️ **Catalog** – Posters, descriptions, trailers, genres.
- 🏷️ **Genres** – Action, Drama, Comedy, Sci-Fi, etc.
- 📺 **Watchlist / My List** – Save to watch later.
- ❤️ **Favorites** – Quick access to loved titles.
- ⭐ **Reviews & Ratings** – 1–5 stars plus comments.
- 💬 **Real-time Chat** – Movie rooms, low-latency, scalable rooms/namespaces.
- 🤖 **AI Recommendations** – Personalized suggestions.
- 🛡️ **Toxicity Detection** – NLP moderation (chat & reviews).
- 🛠️ **Admin Panel** – CRUD movies/genres, moderation tools.

---

## 🛠 Tech Stack
**Frontend:** React (Vite), Tailwind/Bootstrap (responsive UI)  
**Backend:** Node.js, Express (REST), Socket.IO (WebSockets)  
**Database:** **PostgreSQL** (users, profiles, movies, genres, watchlists, favorites, reviews, chats)  
**AI:** Collaborative + content-based recommender (scikit-learn/TensorFlow), toxicity detection (BERT-style)  
**Tools:** **pgAdmin**, psql, dbdiagram.io, Git/GitHub

---

## 🗂 Monorepo Structure

```

.
├─ api/                # Express server, REST, Socket.IO, DB access
├─ frontend/           # React app (Vite)
├─ .vscode/            # (optional) workspace settings
├─ package.json        # (optional) root scripts for tooling
└─ README.md

````


---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **PostgreSQL** ≥ 15
- **npm** ≥ 9

> Tip: ensure PostgreSQL is running and you have a database/user ready.

### Environment Variables

**api/.env**
```env
# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# JWT / Security
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=7d

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=cinestream

````

**frontend/.env**

```env
# Vite expects VITE_ prefix
VITE_API_BASE_URL=http://localhost:4000
```

### Install & Run (Two Terminals)

> When you clone the repo, open **two terminals** (one for `api`, one for `frontend`):

**Terminal 1 – Backend (api)**

```bash
cd api
npm i
npm run dev
# Server on http://localhost:4000
```

**Terminal 2 – Frontend (frontend)**

```bash
cd frontend
npm i
npm run dev
# Vite on http://localhost:5173
```

---

## 🗄 Database Schema (Overview)

Tables (minimum):

* `users` (id, name, email, password_hash, role)
* `profiles` (id, user_id, display_name, avatar_url)
* `genres` (id, name)
* `movies` (id, title, description, release_year, poster_path, trailer_url, genre_id)
* `watchlists` (id, profile_id, movie_id) **UNIQUE(profile_id, movie_id)**
* `favorites` (id, profile_id, movie_id) **UNIQUE(profile_id, movie_id)**
* `reviews` (id, profile_id, movie_id, rating, comment, created_at)
* `chats` (id, movie_id, profile_id, message, created_at)

> Add **UNIQUE** constraints to prevent duplicates in `watchlists`, `favorites`, and one review per profile per movie if desired.

---

## 🔌 Core API Endpoints

> Prefix: `/api` (e.g., `http://localhost:4000/api`)

**Auth**

* `POST /auth/register` → `{ token, user }`
* `POST /auth/login` → `{ token, user }`
* `GET /auth/profile` (Bearer token)

**Movies**

* `GET /movies` – list (supports search/filter)
* `GET /movies/top-rated` – with `average_rating`, `total_ratings`
* `GET /movies/:id`
* `POST /movies` *(admin)* – create
* `PUT /movies/:id` *(admin)*
* `DELETE /movies/:id` *(admin)*

**Genres**

* CRUD endpoints *(admin)*

**Watchlist & Favorites**

* `GET /profiles/:id/watchlist`
* `POST /watchlist/toggle` (profile_id, movie_id)
* `GET /profiles/:id/favorites`
* `POST /favorites/toggle`

**Reviews**

* `GET /movies/:id/reviews`
* `POST /reviews` (profile_id, movie_id, rating, comment)
* `DELETE /reviews/:id` *(admin or owner)*

**Chat (Socket.IO)**

* Namespace: `/chat`
* Room: `movie:{movieId}`
* Events: `join`, `message`, `moderation:flagged`, `leave`

---

## 🗺 Roadmap / Timeline

**Phase 1 (Weeks 1–2): Setup & DB**

* React + Express scaffolding, MySQL schema, DB connection

**Phase 2 (Weeks 3–4): Auth & Profiles**

* Signup/login, roles, multiple profiles, protected routes

**Phase 3 (Weeks 5–6): Core Catalog**

* Movies, genres, posters, trailers, watchlist, favorites

**Phase 4 (Weeks 7–8): Reviews, Chat, AI Toxicity**

* Reviews/ratings + Socket.IO chat + NLP moderation

**Phase 5 (Weeks 9–10): AI Recs & Polish**

* Hybrid recommender, admin moderation tools, QA & demo

---

## 🧰 Common Tasks

**Remove `node_modules` from GitHub (keep locally)**

```bash
git rm -r --cached node_modules api/node_modules
echo -e "node_modules/\napi/node_modules/" >> .gitignore
git add .gitignore
git commit -m "Remove node_modules from repo and ignore them"
git push origin main
```

**Seed / Migrate (example)**

```bash
# Depending on your setup:
npm run migrate
npm run seed
```

**Environment sanity check**

* Backend prints `Server listening on :4000`
* Frontend uses `VITE_API_BASE_URL` to hit the API
* CORS allows `http://localhost:5173`

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/awesome-thing`
3. Commit: `git commit -m "feat: add awesome thing"`
4. Push: `git push origin feat/awesome-thing`
5. Open a Pull Request

---

## 📄 License

This project is for educational use. For production licensing, add a LICENSE file (MIT recommended).

---

### 🍿 Screenshots (Optional)

You can add screenshots/gifs here:

```
frontend/public/screenshots/
```

Then reference them:

```md
![Home](public/screenshots/home.png)
![Movie Details](public/screenshots/details.png)
```
