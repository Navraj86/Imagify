# 🎨 Imagify: AI Text-to-Image SaaS Platform

<p align="center">
  <a href="https://imagify-frontend-ten.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-imagify.vercel.app-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>Imagify</strong> is a full-stack AI image generation platform built with Next.js, Express and MongoDB. Users turn text prompts into high-quality images, manage a credit balance, buy credit packs through Razorpay, and download their images instantly.
</p>

---

## 🚀 Live Demo

- **Frontend App:** [https://imagify-frontend-ten.vercel.app](https://imagify-frontend-ten.vercel.app)

---

## ✨ Features

- 🪄 **Text-to-Image Studio:** Generate 1024 × 1024 images from text prompts with the ClipDrop API. Includes style presets (Photo, 3D, Anime, Watercolor, Cinematic), prompt ideas, a live progress indicator and a recent-generations strip.
- 💳 **Credit-Based Pricing:** New accounts get 5 free credits; one credit buys one image. Credits are only deducted when a generation succeeds.
- 💰 **Razorpay Payments:** One-time credit packs with signature-verified payments. Each payment is credited exactly once, even if verification is retried.
- 🔐 **Authentication & Security:** JWT sessions, bcrypt password hashing, input validation and clear handling of expired sessions.
- 📥 **One-Click Download:** Save generated images as PNG files named after the prompt.
- 📱 **Responsive Dark UI:** Built with shadcn/ui and Tailwind CSS for mobile, tablet and desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) with [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Animation:** [Motion](https://motion.dev/)
- **Icons & Toasts:** [Lucide](https://lucide.dev/) and [Sonner](https://sonner.emilkowal.ski/)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **API Integration:** [ClipDrop](https://clipdrop.co/apis) text-to-image & [Razorpay](https://razorpay.com/) payments

---

## 📂 Project Structure

```text
Imagify/
├── client/                   # Frontend Next.js Application
│   ├── src/
│   │   ├── app/              # App Router: layout, / (Home), /result (Studio), /buy (Pricing), 404, error, icons
│   │   ├── assets/           # Images and static content (plans, prompts, style presets)
│   │   ├── components/       # Navbar, AuthDialog, Pricing, landing sections, studio/
│   │   │   └── ui/           # shadcn/ui components (add more with `npx shadcn add <name>`)
│   │   ├── context/          # AppContext for global state (auth, credits, generation history)
│   │   ├── lib/              # API helpers, currency formatting, Razorpay loader
│   │   └── App.jsx           # Client shell (navbar, footer, background)
│   ├── components.json       # shadcn/ui configuration
│   ├── next.config.mjs
│   ├── .env.example
│   └── package.json
│
├── server/                   # Backend Express Application
│   ├── config/               # Database connection (MongoDB)
│   ├── controllers/          # Business logic (user, image, payment)
│   ├── middlewares/          # Auth middleware (token verification)
│   ├── models/               # Mongoose schemas (User, Transaction)
│   ├── routes/               # Express API endpoints
│   ├── utils/                # Shared helpers
│   ├── server.js             # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── vercel.json           # Serverless deployment configuration
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v20.9 or later, required by Next.js 16)
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
cp .env.example .env
```

Fill in `server/.env`:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# AI Image Generation API Key
CLIPDROP_API=your_clipdrop_api_key

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR

# Optional: comma-separated frontend URLs allowed to call the API
CLIENT_URL=http://localhost:3000
```

Start the backend server:
```bash
# Development mode
npm run dev
# OR production mode
npm start
```
*Backend will run on `http://localhost:4000`.*

---

#### 3. Frontend Setup
In a new terminal window:
```bash
cd ../client
npm install
cp .env.example .env
```

Fill in `client/.env`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
# Must match CURRENCY in server/.env (it's what Razorpay charges)
NEXT_PUBLIC_CURRENCY=INR
```

Start the Next.js development server:
```bash
npm run dev
```
*Frontend will run on `http://localhost:3000`.*

---

### 🧪 Testing Payments

With Razorpay **test** keys (`rzp_test_...`), no real money is charged and the pricing page shows a test-mode notice.

1. Open **Pricing** and choose a plan.
2. In Razorpay checkout, choose **Netbanking** and pick any bank.
3. Click **Success** on Razorpay's demo bank page (or **Failure** to test a declined payment).

Indian [test cards](https://razorpay.com/docs/payments/payments/test-card-details/) also work. International cards are declined unless they're enabled in your Razorpay dashboard.

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

Authenticated requests send the JWT in a `token` header.

---

## 🚀 Deployment

- **Frontend:** Deploy to [Vercel](https://vercel.com/) by importing the repo with **Root Directory** set to `client`. Vercel detects Next.js automatically, so no build or output settings are needed. Add the `NEXT_PUBLIC_*` variables from `client/.env.example` in the project settings.
- **Backend:** Configured for Vercel Serverless Functions via `server/vercel.json`, or deploy to platforms like [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://www.heroku.com/). Add the variables from `server/.env.example`, and set `CLIENT_URL` to your frontend URL.

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
