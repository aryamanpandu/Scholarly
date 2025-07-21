# 🎓 Scholarly

**Scholarly** is a web-based flashcard application designed to help learners retain information more effectively through active recall and spaced repetition. Users can organize content into **Topics**, which contain **Decks** of **Flashcards**, making studying structured and engaging.

---

## 🚀 Features

- 📚 **Topic-based organization** — Group related flashcards under meaningful categories.
- 🗂️ **Decks within topics** — Manage flashcards in modular, reusable sets.
- 🃏 **Flashcard system** — Each card has a front and back for Q&A-style learning.
- 🌙 **Dark/light theme toggle** — Better UX for night owls and early birds.
- ⚡ **Fast and responsive UI** — Built with performance-focused tools.

---

## 🧰 Tech Stack

### 🖥️ Frontend (`/client`)
Built using **React** and styled with **Tailwind CSS** and **Radix UI** components.

- **React 19** with **TypeScript**
- **Tailwind CSS** for utility-first styling
- **Vite** for fast dev server and bundling
- **Framer Motion** for animations
- **React Router DOM** for client-side routing
- **React Hook Form + Zod** for form handling and validation
- **Lucide React** and **Bootstrap Icons** for sleek UI icons
- **Dark mode support** via `next-themes`

### ⚙️ Backend (`/server`)
A RESTful API built with **Express.js** and **MySQL** for managing users, sessions, and flashcards.

- **Express 5** with **TypeScript**
- **MySQL** with `mysql2` driver
- **Session management** with `express-session` and `express-mysql-session`
- **Authentication** with `bcrypt` and `uuid`
- **CORS** and `dotenv` support

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or later)
- MySQL database

### Clone the Repository

```bash
git clone https://github.com/<your-username>/scholarly.git
cd scholarly

Setup .env file in the /server directory:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=scholarly
SESSION_SECRET=your_secret

To start the development: 
npm run dev

Don't forget to connect to mysql😊.
