# Imagify

Imagify is a full-stack web application that allows users to generate, download, and manage AI-generated images. The project is divided into a React-based frontend and a Node.js/Express backend with MongoDB for data storage.

## Features

- User authentication and profile management
- AI-powered image generation
- Download and share generated images
- Credit-based system for image generation
- Transaction history and credit purchase
- Responsive and modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

## Project Structure

```
client/           # Frontend (React)
  src/
    components/   # Reusable UI components
    context/      # React context for global state
    pages/        # Main pages (Home, Result, BuyCredit)
    assets/       # Images and SVGs
  ...

server/           # Backend (Node.js/Express)
  config/         # Database configuration
  controllers/    # Route controllers
  middlewares/    # Express middlewares
  models/         # Mongoose models
  routes/         # API routes
  ...
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

#### 1. Clone the repository
```sh
git clone <repo-url>
cd Imagify
```

#### 2. Install dependencies

##### Frontend
```sh
cd client
npm install
```

##### Backend
```sh
cd ../server
npm install
```

#### 3. Configure Environment Variables
- Create a `.env` file in the `server/` directory with your MongoDB URI and any required secrets.

#### 4. Run the Application

##### Start Backend
```sh
cd server
npm start
```

##### Start Frontend
```sh
cd client
npm run dev
```

- The frontend will typically run on `http://localhost:5173`
- The backend will typically run on `http://localhost:5000`

## Deployment
- The backend is ready for deployment on Vercel (see `vercel.json`).
- The frontend can be deployed to Vercel, Netlify, or any static hosting provider.

## License

This project is licensed under the MIT License.
