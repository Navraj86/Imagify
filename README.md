# Imagify

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://imagify-nu-six.vercel.app)

Imagify turns text prompts into images. You sign up, get 5 free credits, describe what you want, and download the result. When you run out, you can buy more credits through Razorpay.

**Live demo:** [imagify-nu-six.vercel.app](https://imagify-nu-six.vercel.app)

The frontend is a Next.js app and the backend is an Express API with MongoDB. Images are generated with the ClipDrop text-to-image API.

## What it does

- Generates 1024 × 1024 images from a text prompt (up to 1,000 characters)
- Optional style presets (Photo, 3D, Anime, Watercolor, Cinematic), prompt ideas and a "Surprise me" button
- Download the image, copy the prompt, or start over in one click
- Keeps your last 12 images from the current session so you can go back and download them
- Credit system: 5 free credits on sign-up, 1 credit per image, and you're only charged when an image actually generates
- Credit packs paid through Razorpay, verified on the server before credits are added
- Sign up and log in with email and password (JWT sessions, bcrypt hashed passwords)
- Works on phones, tablets and desktop

## Built with

**Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui (Radix UI), Motion, Sonner, Lucide icons, Axios

**Backend:** Node.js, Express 5, MongoDB with Mongoose, JWT, bcrypt, Razorpay, ClipDrop API

## Folder layout

```text
Imagify/
├── client/                 Next.js frontend
│   └── src/
│       ├── app/            Pages: home (/), studio (/result), pricing (/buy), 404 and error pages
│       ├── App.jsx         App shell: navbar, footer and the lazy-loaded sign-in dialog
│       ├── components/     Navbar, sign-in dialog, studio, pricing and the home page sections
│       │   └── ui/         shadcn/ui components
│       ├── context/        App state: login, credits, generated images
│       ├── lib/            API helpers, price formatting, Razorpay loader
│       └── assets/         Images, plans, prompt ideas, style presets
│
└── server/                 Express API
    ├── config/             MongoDB connection
    ├── controllers/        Users, images and payments
    ├── middlewares/        Checks the login token
    ├── models/             User and Transaction schemas
    ├── routes/             API routes
    ├── utils/              Shared error response helper
    ├── vercel.json         Vercel serverless config
    └── server.js           Entry point
```

## Running it locally

You'll need Node.js 20.9 or newer, a MongoDB database (MongoDB Atlas works fine), a [ClipDrop](https://clipdrop.co/apis) API key and [Razorpay](https://dashboard.razorpay.com/) test keys.

### 1. Get the code

```bash
git clone https://github.com/Navraj86/Imagify.git
cd Imagify
```

### 2. Start the backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```env
PORT=4000
# The "imagify" database is selected automatically, so no database name is needed in the URI
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d

CLIPDROP_API=your_clipdrop_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR

# Optional. Only these frontend URLs can call the API (comma separated). Unset allows any origin.
CLIENT_URL=http://localhost:3000
```

Then run it:

```bash
npm run dev     # restarts on file changes
# or
npm start
```

The API runs on `http://localhost:4000`.

### 3. Start the frontend

In a second terminal:

```bash
cd client
npm install
cp .env.example .env
```

Fill in `client/.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_CURRENCY=INR
```

`NEXT_PUBLIC_CURRENCY` should match `CURRENCY` on the server, because that's the currency Razorpay actually charges in.

```bash
npm run dev
```

Open `http://localhost:3000`.

## Plans

| Plan | Credits | Price (INR) |
| :--- | ---: | ---: |
| Free (on sign-up) | 5 | 0 |
| Basic | 100 | 10 |
| Advanced | 500 | 50 |
| Business | 5,000 | 250 |

Prices live in `server/controllers/user.controller.js` and that's what gets charged. The list in `client/src/assets/assets.js` is only for display, so keep the two in sync if you change them.

## How credits and payments work

**Generating an image**

1. The server takes 1 credit in a single atomic update that only succeeds if your balance is above 0. Two requests sent at the same time can't spend the same credit.
2. It sends the prompt to ClipDrop (60 second timeout).
3. If ClipDrop fails or times out, the credit is refunded.
4. The image comes back as a base64 PNG. Nothing is stored on the server, which is why the history only lasts for the current session.

**Buying credits**

1. `pay-razor` saves a pending transaction and creates a Razorpay order for the plan's price.
2. Razorpay checkout opens in the browser.
3. `verify-razor` checks Razorpay's HMAC signature, then fetches the order and payment from Razorpay to confirm the amounts match.
4. If the payment is only authorized, the server captures it.
5. The transaction is flipped to paid in one atomic update, so retrying the request can never add the credits twice.

## Testing payments

If you use Razorpay test keys (they start with `rzp_test_`), no real money is taken and the pricing page shows a test mode notice.

1. Go to Pricing and pick a plan.
2. In the Razorpay window, choose **Netbanking** and any bank.
3. On Razorpay's demo bank page, click **Success**. Click **Failure** instead if you want to see what a declined payment looks like.

Razorpay's [Indian test cards](https://razorpay.com/docs/payments/payments/test-card-details/) work too. International cards get declined unless you turn them on in your Razorpay dashboard.

## API

| Method | Endpoint | Body | What it does | Login needed |
| :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/user/register` | `name`, `email`, `password` | Create an account (password at least 8 characters) | No |
| `POST` | `/api/user/login` | `email`, `password` | Log in and get a token | No |
| `GET` | `/api/user/credits` | | Get the current credit balance | Yes |
| `POST` | `/api/image/generate-image` | `prompt` | Generate an image from a prompt | Yes |
| `POST` | `/api/user/pay-razor` | `planId` (`Basic`, `Advanced` or `Business`) | Start a credit pack purchase | Yes |
| `POST` | `/api/user/verify-razor` | `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` | Confirm the payment and add credits | Yes |

For the routes that need a login, send the token in a `token` header.

Every response is JSON with a `success` flag and a `message` when something goes wrong. Request bodies are limited to 10 KB.

## Deploying

Both parts can go on Vercel as two separate projects.

**Backend:** import the repo with the root directory set to `server`. It already has a `vercel.json`, and `server.js` exports the Express app so it runs as a serverless function. Add everything from `server/.env.example` as environment variables, and set `CLIENT_URL` to your frontend's URL.

**Frontend:** import the repo again with the root directory set to `client`. Vercel picks up Next.js on its own. Add the three `NEXT_PUBLIC_` variables, with `NEXT_PUBLIC_BACKEND_URL` set to your deployed backend URL (not localhost).

`NEXT_PUBLIC_` values are baked in when the site builds. If you add or change one, redeploy the frontend for it to take effect. The build stops with an error if `NEXT_PUBLIC_BACKEND_URL` is missing or points at localhost on Vercel, so you won't accidentally ship a site that can't reach the API.

## Contributing

Issues and pull requests are welcome. If you want to change something big, open an issue first so we can talk about it.

## License

MIT
