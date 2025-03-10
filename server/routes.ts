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

      // Get the bucket state
      const state = objectStorage.state;
      console.log('Bucket state:', state);

      // Prefix the key with 'images/'
      const key = `images/${req.params.key}`;
      console.log(`Attempting to access key: ${key}`);

      // List files to check what's available
      const files = await objectStorage.list();
      console.log('Available files:', files);

      // Try to get the file directly using state
      const file = state.files.find(f => f.key === key);
      if (!file) {
        throw new Error(`File not found: ${key}`);
      }

      // Get the file data
      const response = await fetch(file.url);
      const buffer = await response.arrayBuffer();

      // Send the file with appropriate headers
      res.setHeader('Content-Type', file.type || 'image/svg+xml');
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