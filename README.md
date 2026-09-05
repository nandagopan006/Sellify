# 🛍️ Sellify

A mini **OLX / Facebook Marketplace** clone. Sign up, list your stuff, browse
what others are selling, add to cart, and check out.

Built with **Django** (backend) and **React** (frontend).

---

## What's inside

| Folder | What it is |
|--------|------------|
| `backend/` | Django server — database, login, API |
| `frontend/` | React website — what you see in the browser |

> ⚠️ Both must run at the same time, in **two separate terminals**.

---

## Setup

You need **Python 3.10+** and **Node.js 18+** installed.

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Runs at **http://127.0.0.1:8000**

> A *venv* is a private box for this project's Python packages. Create it once,
> but **activate it every time** you open a new terminal. You'll see `(venv)`
> in your terminal when it's active.

Optional — make an admin account to view the data at `/admin/`:

```bash
python manage.py createsuperuser
```

### 2. Frontend

Open a **new terminal** (leave the backend running):

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** 🎉

---

## Features

- Sign up / log in / log out (JWT tokens, stays logged in after refresh)
- Browse and filter products by category and price
- List items for sale, edit or delete your own
- Cart saved in your browser
- Checkout — reduces stock, marks items sold
- You can't buy your own product

---

## API

Base URL: `http://127.0.0.1:8000`
🔒 = needs header `Authorization: Bearer <access-token>`

| Method | Endpoint | | What it does |
|--------|----------|---|--------------|
| POST | `/api/auth/signup/` | | Create account |
| POST | `/api/auth/login/` | | Log in, get tokens |
| POST | `/api/auth/logout/` | | Log out |
| GET | `/api/products/` | | List products |
| POST | `/api/products/` | 🔒 | Create listing |
| GET | `/api/products/<id>/` | | One product |
| PUT | `/api/products/<id>/` | 🔒 | Update your listing |
| DELETE | `/api/products/<id>/` | 🔒 | Delete your listing |
| GET | `/api/products/my-products/` | 🔒 | Your listings |
| POST | `/api/checkout/` | 🔒 | Buy cart items |

Filters: `/api/products/?category=books&min_price=100&max_price=500`

**Signup body:**

```json
{ "username": "nanda", "email": "nanda@example.com", "password": "Strong@123" }
```

**Checkout body:**

```json
{ "items": [{ "product_id": 1, "quantity": 1 }] }
```

---

## Structure

```
backend/
├── config/          # settings.py, urls.py
└── apps/
    ├── accounts/    # users, signup, login, logout
    └── products/    # products + checkout

frontend/src/
├── pages/           # one file per screen
├── components/      # Navbar, ProductCard, Toast...
├── features/        # Redux state: auth, products, cart, checkout
├── routes/          # URL to page mapping + route guards
└── app/store.js     # Redux store
```

---

## Common problems

| Problem | Fix |
|---------|-----|
| `No module named 'django'` | Activate the venv (look for `(venv)`) |
| PowerShell blocks `activate` | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| No products load | Backend isn't running |
| `Port 8000 already in use` | Close the old server, or `runserver 8001` |
| `npm run dev` fails after a pull | Run `npm install` again |
| Want a fresh database | Delete `backend/db.sqlite3`, run `migrate` |

---

## Before deploying

This is set up for local development only. For production: move `SECRET_KEY` to
an env var, set `DEBUG = False`, restrict `CORS_ALLOW_ALL_ORIGINS`, switch to
PostgreSQL, and move the hardcoded API URL out of `frontend/src/features/`.
