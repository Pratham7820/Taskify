# Taskify 📝  
A full-stack task management application with authentication, task prioritization, and CRUD operations.

---

## 📌 Overview

**Taskify** is a web-based task management system that allows users to:

- Sign up and sign in securely
- Create, view, edit, and delete tasks
- Set due dates and priorities
- Mark tasks as completed or pending
- View tasks with pagination
- Access only their own tasks using authentication

The project is built using a **frontend + backend monorepo structure**.

---
🚀 Step-by-Step Setup
1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/taskify.git
cd taskify
```

2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a .env file inside the backend folder:
```bash
DATABASE_URL=mongodb://localhost:27017/taskify
JWT_SECRET=your_secret_key
```

Start the backend server:
```bash
npm run dev
```

Backend will run on:
```bash
http://localhost:8080
```

3️⃣ Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:
```bash
http://localhost:5173
```
