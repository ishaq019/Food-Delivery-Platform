# 🍔 Food Delivery Platform (MERN)

![Food Delivery Banner](assets/banner.png)

A full-stack **food ordering platform** built with the **MERN stack**—featuring a customer-facing storefront, an admin dashboard, and a Node/Express API powered by MongoDB.

🌐 **Live Demo:** https://syedishaq.me/Food-Delivery-Platform/  
🧑‍💼 **Admin (Live):** https://syedishaq.me/Food-Delivery-Platform/admin

---

## 📚 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Key Features](#-key-features)
- [🧰 Tech Stack](#-tech-stack)
- [🗂️ Project Structure](#️-project-structure)
- [⚙️ Setup & Installation](#️-setup--installation)
  - [✅ Prerequisites](#-prerequisites)
  - [🔧 Backend Setup](#-backend-setup)
  - [🎨 Frontend Setup](#-frontend-setup)
  - [🧑‍💼 Admin Panel Setup](#-admin-panel-setup)
- [🔐 Environment Variables](#-environment-variables)
- [🔌 API Endpoints](#-api-endpoints)
- [🧪 Usage](#-usage)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Overview

This repository contains three main parts:

- **Frontend** (Customer UI): browse menu, manage cart, place orders, view order history
- **Admin Panel**: manage food items and track/update orders
- **Backend API**: authentication, food CRUD (admin), cart management, orders and status updates

> Note: The frontend/admin currently reference a deployed API URL directly inside the code (see [Configuration](#-usage)).

---

## 🚀 Key Features

### 👤 Customer (Frontend)

- 🔐 JWT-based authentication (register/login)
- 🍽️ Browse and view food items
- 🛒 Cart management (add/remove + totals)
- 📦 Place orders with address details
- 🧾 View your orders & status updates

### 🧑‍💼 Admin Panel

- ➕ Add new food items (with image upload)
- 🗑️ Remove food items
- 📋 View all orders
- 🔄 Update order status (admin-only)

---

## 🧰 Tech Stack

- **Frontend / Admin:** React + Vite, React Router, Axios, React Toastify
- **Backend:** Node.js, Express.js, JWT, Bcrypt, Multer
- **Database:** MongoDB + Mongoose
- **Assets:** Static image serving via `/images` (uploads folder)

---

## 🗂️ Project Structure

```txt
Food-Delivery-Platform/
├── backend/                 # Node/Express API
│   ├── config/              # DB config
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── uploads/             # Uploaded images (local)
│   ├── .env.example         # Env template
│   └── server.js            # Server entry
├── frontend/                # Customer UI (React/Vite)
└── admin/                   # Admin dashboard (React/Vite)
```

---

## ⚙️ Setup & Installation

### ✅ Prerequisites

- Node.js (recommended: latest LTS)
- MongoDB (local or Atlas)
- Git

---

### 🔧 Backend Setup

```bash
cd backend
npm install
```

1. Create a `.env` file inside `backend/` based on `.env.example`
2. Start the server:

```bash
npm run server
```

Backend runs on:  
http://localhost:4000 (default)

---

### 🎨 Frontend Setup (Customer)

```bash
cd frontend
npm install
npm run dev
```

Vite dev server typically runs on:  
http://localhost:5173

---

### 🧑‍💼 Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Vite dev server typically runs on:  
http://localhost:5174 (or next available port)

---

## 🔐 Environment Variables

Backend variables (see `backend/.env.example`):

```env
# MongoDB
MONGO_URL=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
SALT=10

# Payment keys (optional / future-ready)
ROZAR_KEY=your_key_id
ROZAR_SECRET_KEY=your_secret_key

# Webhook (optional)
WEBHOOK_URL=
```

✅ Minimum required to run locally:

- `MONGO_URL`
- `JWT_SECRET`
- `SALT`

---

## 🔌 API Endpoints

Base URL (local): http://localhost:4000

### 👤 Auth

- POST `/api/user/register`
- POST `/api/user/login`

### 🍔 Food

- GET  `/api/food/list`
- POST `/api/food/add` (admin, multipart image upload)
- POST `/api/food/remove` (admin)

### 🛒 Cart (auth required)

- POST `/api/cart/add`
- POST `/api/cart/remove`
- POST `/api/cart/get`

### 📦 Orders

- POST `/api/order/place` (auth required)
- POST `/api/order/verify`
- POST `/api/order/userorders` (auth required)
- GET  `/api/order/list` (admin)
- POST `/api/order/status` (admin)

### 🖼️ Images

- GET `/images/<filename>` (static serving from backend uploads)

---

## 🧪 Usage

### 🔁 Point the Frontend/Admin to Your Local Backend

In the current code, the API base URL is set directly in:

- `frontend/src/context/StoreContext.jsx`
- `admin/src/App.jsx` (and/or related admin components)

Update the base URL to your local backend:

```js
const url = "http://localhost:4000";
```

✅ Recommendation (best practice): replace hardcoded URLs with environment variables like `VITE_API_URL`.

---

## 🛠️ Troubleshooting

### MongoDB connection fails

- Verify `MONGO_URL` in `backend/.env`
- Ensure IP is allowed (MongoDB Atlas) and credentials are correct

### Unauthorized errors

- Ensure requests include token in headers
- Re-login to refresh stored token

### Images not loading

- Confirm backend is running
- Verify that `/images` endpoint is accessible
- Ensure `backend/uploads/` exists when running locally

### Admin actions blocked

- Admin operations check user role on the server
- Make sure your user has role: `"admin"` in the database

---

## 🤝 Contributing

Contributions are welcome! ✨  
If you’d like to improve the project:

1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

No license is currently specified in this repository.  
If you plan to make it open-source friendly, consider adding a license (e.g., MIT, Apache-2.0).

