import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'your-mongodb-uri'; // Replace with your MongoDB URI
const dbName = 'your-database-name'; // Replace with your database name

const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, comment, postId } = req.body;

  if (!name || !email || !comment || !postId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (!client.db(dbName)) await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('comments');

    await collection.insertOne({ name, email, comment, postId, createdAt: new Date() });

    res.status(201).json({ message: 'Comment submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}