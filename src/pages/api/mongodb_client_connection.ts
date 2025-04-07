import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Load URI from environment variables
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Reuse the client instance for serverless deployments
if (process.env.NODE_ENV === 'development') {
  // Create a global instance to preserve the same client during HMR in development
  if (!(global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise) {
      client = new MongoClient(uri, options);
      (global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise = client.connect();
  }
  clientPromise = (global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise!;
} else {
  // In production, create a new client connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;