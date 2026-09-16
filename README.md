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
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB URI](https://cloud.mongodb.com/) (MongoDB Atlas or local instance)

---

### Installation & Local Setup

#### 1. Clone the repository
```bash
git clone https://github.com/Navraj86/Imagify.git
cd Imagify
```

#### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# AI Image Generation API Key (e.g., ClipDrop)
CLIPDROP_API=your_clipdrop_api_key

# Payment Gateway (if enabled)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend server:
```bash
# Development mode
npm run dev
# OR production mode
npm start
```
*Backend will run on `http://localhost:5000`.*

---

#### 3. Frontend Setup
In a new terminal window:
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
# Optional payment public keys
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the Vite development server:
```bash
npm run dev
```
*Frontend will run on `http://localhost:5173`.*

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/user/register` | Register a new user account | No |
| `POST` | `/api/user/login` | Log in and receive JWT token | No |
| `GET` | `/api/user/credits` | Fetch available user credits | Yes |
| `POST` | `/api/image/generate-image` | Generate an image from prompt | Yes |
| `POST` | `/api/user/pay-razor` | Create order for credit pack | Yes |
| `POST` | `/api/user/verify-razor` | Verify payment & credit account | Yes |

---

## 🚀 Deployment

- **Frontend:** Easily deployed to [Vercel](https://vercel.com/) by importing the `/client` directory (Build command: `npm run build`, Output directory: `dist`).
- **Backend:** Configured for Vercel Serverless Functions via `server/vercel.json` or can be deployed to platforms like [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://www.heroku.com/).

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
