# ABC — Productivity Calculator

A modern, full-stack productivity calculator built with Next.js, TypeScript, and SQLite.

## Features

- Basic arithmetic: +, −, ×, ÷
- Advanced operations: %, √, power (^)
- Calculation history persisted in SQLite
- Keyboard input support
- Responsive dark theme UI

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/calculator.sqlite` | Path to SQLite database |

## API Endpoints

- `GET /api/history` — Retrieve last 50 calculations
- `POST /api/history` — Save a new calculation (`{ expression, result }`)

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `0-9` | Input digit |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Operators |
| `^` | Power |
| `%` | Percentage |
| `Enter` / `=` | Calculate |
| `Backspace` | Delete last digit |
| `Escape` | Clear |
