# Imagify

Imagify turns text prompts into images. You sign up, get 5 free credits, describe what you want, and download the result. When you run out, you can buy more credits through Razorpay.

**Live demo:** [imagify-nu-six.vercel.app](https://imagify-nu-six.vercel.app)

The frontend is a Next.js app and the backend is an Express API with MongoDB. Images are generated with the ClipDrop text-to-image API.

## What it does

- Generates 1024 × 1024 images from a text prompt
- Optional style presets (Photo, 3D, Anime, Watercolor, Cinematic) and a few prompt ideas to get started
- Keeps your recent images from the current session so you can go back and download them
- Credit system: 5 free credits on sign-up, 1 credit per image, and you're only charged when an image actually generates
- Credit packs paid through Razorpay, verified on the server before credits are added
- Sign up and log in with email and password (JWT sessions, bcrypt hashed passwords)
- Works on phones, tablets and desktop

## Built with

**Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Motion, Axios

**Backend:** Node.js, Express, MongoDB with Mongoose, JWT, bcrypt, Razorpay, ClipDrop API

## Folder layout

```text
Imagify/
├── client/                 Next.js frontend
│   └── src/
│       ├── app/            Pages: home (/), studio (/result), pricing (/buy), 404 and error pages
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
    └── server.js           Entry point
```

## Running it locally

You'll need Node.js 20.9 or newer and a MongoDB database (MongoDB Atlas works fine).

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
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d

CLIPDROP_API=your_clipdrop_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR

# Optional. Only these frontend URLs can call the API (comma separated)
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

## Testing payments

If you use Razorpay test keys (they start with `rzp_test_`), no real money is taken and the pricing page shows a test mode notice.

1. Go to Pricing and pick a plan.
2. In the Razorpay window, choose **Netbanking** and any bank.
3. On Razorpay's demo bank page, click **Success**. Click **Failure** instead if you want to see what a declined payment looks like.

Razorpay's [Indian test cards](https://razorpay.com/docs/payments/payments/test-card-details/) work too. International cards get declined unless you turn them on in your Razorpay dashboard.

## API

| Method | Endpoint | What it does | Login needed |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/user/register` | Create an account | No |
| `POST` | `/api/user/login` | Log in and get a token | No |
| `GET` | `/api/user/credits` | Get the current credit balance | Yes |
| `POST` | `/api/image/generate-image` | Generate an image from a prompt | Yes |
| `POST` | `/api/user/pay-razor` | Start a credit pack purchase | Yes |
| `POST` | `/api/user/verify-razor` | Confirm the payment and add credits | Yes |

For the routes that need a login, send the token in a `token` header.

## Deploying

Both parts can go on Vercel as two separate projects.

**Backend:** import the repo with the root directory set to `server`. It already has a `vercel.json`. Add everything from `server/.env.example` as environment variables, and set `CLIENT_URL` to your frontend's URL.

**Frontend:** import the repo again with the root directory set to `client`. Vercel picks up Next.js on its own. Add the three `NEXT_PUBLIC_` variables, with `NEXT_PUBLIC_BACKEND_URL` set to your deployed backend URL (not localhost).

`NEXT_PUBLIC_` values are baked in when the site builds. If you add or change one, redeploy the frontend for it to take effect. The build stops with an error if `NEXT_PUBLIC_BACKEND_URL` is missing, so you won't accidentally ship a site that can't reach the API.

## Contributing

Issues and pull requests are welcome. If you want to change something big, open an issue first so we can talk about it.

## License

MIT
