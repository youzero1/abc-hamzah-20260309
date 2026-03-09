# abc - Notes App

A Next.js Notes App with e-commerce-inspired organization features built with TypeScript, TypeORM, and SQLite.

## Features

- 📝 **CRUD Operations** - Create, read, update, and delete notes
- 🗂️ **Categories** - Organize notes into e-commerce-style categories
- 🔍 **Search & Filter** - Search by title/content, filter by category and priority
- 📱 **Mobile-Responsive** - Mobile-first design
- 📌 **Pin Notes** - Pin important notes to the top
- 🎯 **Priority Levels** - Low, Medium, High priority
- 📊 **Dashboard** - Statistics and recent notes overview

## Categories

- General
- Product Ideas
- Inventory
- Suppliers
- Marketing
- Orders

## Getting Started

### With Docker Compose (Recommended)

```bash
docker-compose up --build
```

Visit http://localhost:3000

### Local Development

```bash
npm i
npm run dev
```

## Environment Variables

```
DATABASE_PATH=./data/notes.db
NEXT_PUBLIC_APP_NAME=abc
NODE_ENV=development
PORT=3000
```

## API Routes

- `GET /api/notes` - List notes (supports search, category, priority filters)
- `POST /api/notes` - Create a note
- `GET /api/notes/:id` - Get a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **TypeORM** with SQLite (better-sqlite3)
- **Tailwind CSS**
- **Docker**
