import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from '@replit/object-storage';

// Initialize storage client with bucket ID from environment
const objectStorage = new Client({
  bucketId: process.env.REPLIT_BUCKET_ID || 'replit-objstore-eb6fbb48-c0e4-4f0a-860c-88783397643d'
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/assets/:key', async (req, res) => {
    try {
      // Log available methods for debugging
      console.log('Available object storage methods:', Object.keys(objectStorage));

      // Prefix the key with 'images/'
      const key = `images/${req.params.key}`;
      console.log(`Attempting to access key: ${key}`);

      // Try to get the object directly
      const bucket = await objectStorage.bucket();
      const object = await bucket.get(key);
      if (!object) {
        throw new Error(`Object not found: ${key}`);
      }

      // Get the raw data
      const buffer = await object.arrayBuffer();
      const contentType = object.type || 'image/svg+xml';

      // Send the image directly
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Failed to serve image:', error);
      res.status(500).json({ error: 'Failed to serve image', details: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}