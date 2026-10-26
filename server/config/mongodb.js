import mongoose from "mongoose";

const connectDB = async () => {
    // Reuse an open connection (warm serverless invocations, hot reloads)
    if (mongoose.connection.readyState === 1) return;

    mongoose.connection.once('connected', () => {
        console.log('Database connected');
    });
    // dbName instead of appending "/imagify" to the URI, which breaks URIs that carry query params
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'imagify' });
};

export default connectDB;
