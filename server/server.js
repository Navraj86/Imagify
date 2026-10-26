import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/user.routes.js';
import imageRouter from './routes/image.routes.js';

const PORT = process.env.PORT || 4000;
const app = express();

// CLIENT_URL (comma-separated) restricts which sites may call the API; unset allows any origin
const allowedOrigins = process.env.CLIENT_URL?.split(',').map(origin => origin.trim()).filter(Boolean);

app.use(express.json({ limit: '10kb' }));
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins } : undefined));
await connectDB();

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.get('/', (req, res) => {
    res.send('API Working!');
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not found' });
});

// Express calls this for body-parser failures and anything a route throws
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ success: false, message: 'Invalid JSON body' });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'Request body too large' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
});

// Vercel imports the app as a handler; everywhere else, run a normal server
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
