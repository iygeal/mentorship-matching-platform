# Mentorship Matching Platform 🌱✨

A fullstack TypeScript web application designed to connect mentees with mentors for impactful learning experiences. Built with **React + TypeScript + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend.

> 🔗 Live Demo: [https://mentorship-by-iygeal.vercel.app](https://mentorship-by-iygeal.vercel.app)
> 🛠️ Backend: Hosted on Render | Frontend: Hosted on Vercel

---

## ✨ Features

### 👥 Authentication & Authorization
- Secure user registration & login (JWT-based)
- Role-based access for **mentor**, **mentee**, and **admin**
- Persistent sessions via localStorage

### 🤝 Mentorship Matching
- Mentees can discover mentors by skill
- Send mentorship requests and receive approvals
- Mentors can accept or reject requests

### 📅 Session Management
- Mentors can define their availability
- Mentees can book sessions based on availability
- Both parties can leave feedback (mentees can rate sessions)

### 📄 Profile & Dashboard
- View and update personal profile (bio, skills, goals)
- Custom dashboards for mentors and mentees
- Admin routes available (UI in progress)

---

## 📦 Tech Stack

| Layer     | Technology                           |
|-----------|---------------------------------------|
| Frontend  | React, TypeScript, TailwindCSS, Vite |
| Backend   | Node.js, Express.js, TypeScript      |
| Database  | MongoDB (Mongoose ODM)               |
| Hosting   | Frontend: Vercel<br>Backend: Render  |
| Auth      | JWT (with role-based access)         |

---

## 🚀 Getting Started

### Clone the Repo

```bash
git clone https://github.com/iygeal/mentorship-matching-platform.git
cd mentorship-platform-platform
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```
Make sure to create .env file with the following variables before starting the server:

```bash
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
PORT=<your_port>
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Author
 LinkedIn: [Iygeal Anozie](https://www.linkedin.com/in/iygeal/)

Twitter: [Iygeal Anozie](https://twitter.com/iygeal)

GitHub: [Iygeal Anozie](https://github.com/iygeal)