# 🎨 Imagify — AI Text-to-Image SaaS Platform

<p align="center">
  <a href="https://imagify-frontend-ten.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-imagify.vercel.app-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>Imagify</strong> is a modern, full-stack AI image generation platform built with the MERN stack. Users can transform descriptive text prompts into high-quality images, manage token/credit balances, purchase credits, and download generated assets instantly.
</p>

---

## 🚀 Live Demo

- **Frontend App:** [https://imagify-frontend-ten.vercel.app](https://imagify-frontend-ten.vercel.app)

---

## ✨ Features

- 🪄 **Text-to-Image Generation:** Powered by cutting-edge AI diffusion APIs to generate high-resolution images from text prompts.
- 💳 **Credit-Based Economy:** Users are allocated initial credits upon sign-up and spend credits per generation.
- 🔐 **Authentication & Security:** Secure user authentication and authorization using JWT (JSON Web Tokens) and bcrypt password hashing.
- 💰 **Credit Recharge / Payment Integration:** Integrated payment processing for credit top-ups and tracking transaction history.
- 📥 **One-Click Download:** Save generated images directly to your local storage.
- 📱 **Fully Responsive UI:** Built with React and Tailwind CSS for mobile, tablet, and desktop views.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Icons & Assets:** Lucide Icons / Custom SVGs
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **API Integration:** AI Diffusion API (e.g., ClipDrop / OpenAI) & Payment Gateway (Razorpay/Stripe)

---

## 📂 Project Structure

```text
Imagify/
├── client/                   # Frontend React Application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Icons, brand logos, images
│   │   ├── components/       # Navbar, Footer, Header, Testimonials, etc.
│   │   ├── context/          # AppContext for global state (credits, auth, user)
│   │   ├── pages/            # Home, Result (generator), BuyCredit
│   │   ├── App.jsx           # Routes & layout setup
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Backend Express Application
│   ├── config/               # Database connection (MongoDB)
│   ├── controllers/          # Business logic (user, image, payment)
│   ├── middlewares/          # Auth middleware (token verification)
│   ├── models/               # Mongoose schemas (User, Transaction)
│   ├── routes/               # Express API endpoints
│   ├── server.js             # Express app entry point
│   ├── package.json
│   └── vercel.json           # Serverless deployment configuration
└── README.md
