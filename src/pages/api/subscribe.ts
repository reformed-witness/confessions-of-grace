import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge';
const MONGODB_URI = process.env.MONGODB_URI as string; // Add this in your .env.local file
const MONGODB_DB = process.env.MONGODB_DB as string;   // Add this in your .env.local file

// Create a MongoClient instance
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
    if (!cachedClient) {
        cachedClient = new MongoClient(MONGODB_URI);
        await cachedClient.connect();
    }
    return cachedClient.db(MONGODB_DB);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { email } = req.body;

    // Check if email was provided
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address.' });
    }

    try {
        // Connect to the database
        const db = await connectToDatabase();

        // Check if the email already exists
        const existingEmail = await db.collection('subscriptions').findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already subscribed.' });
        }

        // Save email to the database
        await db.collection('subscriptions').insertOne({ email, subscribedAt: new Date() });

        // Respond with success
        return res.status(200).json({ message: 'Successfully subscribed!' });
    } catch (error) {
        // Log the error and respond with a server error status
        console.error('Failed to save subscription:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}