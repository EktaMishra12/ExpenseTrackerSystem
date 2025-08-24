# 💰 Expense Tracker System (MERN Stack)

The **Expense Tracker System** is a full-stack web application built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. It allows users to **add, edit, delete, and view expenses** while keeping track of total income and spending. The app is designed with a clean UI, smooth navigation, and robust backend APIs for financial data management.

🌐 **Live Demo (if deployed)**
**Backend live** : https://expensetrackersystem-8rlm.onrender.com

---

## 📖 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation & Setup](#installation--setup)
* [Usage](#usage)
* [API Endpoints](#api-endpoints)
* [Folder Structure](#folder-structure)
* [Future Enhancements](#future-enhancements)
* [Contributing](#contributing)
* [License](#license)

---

## 🔥 Overview

The **Expense Tracker System** helps users:

* Record income and expenses with categories.
* View financial summaries (balance, income, expenses).
* Persist data with **MongoDB** database.
* Access a responsive, modern UI built with **React + Vite**.
* Secure backend APIs powered by **Node.js & Express**.

---

## ✨ Features

✔️ Add, edit, delete expenses
✔️ Categorize transactions (Food, Travel, Shopping, etc.)
✔️ Dashboard with financial overview
✔️ Persistent data storage using MongoDB
✔️ RESTful API with Express.js
✔️ Context API for global state management in React
✔️ Responsive design (works on mobile & desktop)

---

## 🛠 Tech Stack

* **Frontend**: React.js (Vite), Context API, CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB / MongoDB Atlas
* **Deployment**: Netlify (Frontend) + Render/Heroku (Backend)

---

## ⚡ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/EktaMishra12/ExpenseTrackerSystem.git
cd ExpenseTrackerSystem
```

### 2. Install dependencies for frontend & backend

#### For backend

```bash
cd server
npm install
```

#### For frontend

```bash
cd ../
npm install
```

### 3. Set up environment variables

In `server/config.env` add:

```
MONGO_URI=your-mongodb-uri
PORT=5000
```

### 4. Start the project

#### Run backend

```bash
cd server
npm start
```

#### Run frontend (React + Vite)

```bash
npm run dev
```

---

## 🎮 Usage

1. Open the app in your browser (`http://localhost:5173`).
2. Add your income and expenses.
3. View balance and categories on the dashboard.
4. Data is synced with MongoDB database.

---

## 📡 API Endpoints (Example)

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/expenses`     | Get all expenses     |
| POST   | `/api/expenses`     | Add new expense      |
| PUT    | `/api/expenses/:id` | Update expense by ID |
| DELETE | `/api/expenses/:id` | Delete expense by ID |

---
```bash

expense-tracker-system/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, Signup logic
│   │   └── expenseController.js   # CRUD operations for expenses
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token validation
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Expense.js             # Expense schema
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication routes
│   │   └── expenseRoutes.js       # Expense routes
│   ├── .env                       # Environment variables
│   ├── server.js                  # Entry point for backend
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ExpenseForm.jsx
│   │   ├── context/
│   │   │   └── ExpenseContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── AddExpense.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │       ├── auth/
│   │   │   └── Login.jsx
            └── login.css 
            └── signup.css 
            └── Signup.jsx 
│   │   ├── App.jsx
        ├── App.css
│   │   ├── main.jsx
│   │   ├── style.css
        ├── axios.js
        ├── index.css
│   ├── .env
│   └── package.json
│
└── README.md


---

## 🔮 Future Enhancements

* ✅ Authentication (JWT login/signup)
* ✅ Cloud database (MongoDB Atlas)
* ✅ Charts & graphs for analysis (Recharts/D3.js)
* ✅ Export reports as CSV/PDF
* ✅ Dark mode UI

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Added feature"`)
4. Push branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📜 License

Licensed under the **MIT License** – free to use and modify.

---

✨ Developed by **Ekta Mishra** with ❤️
