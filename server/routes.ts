import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from '@replit/object-storage';

const objectStorage = new Client({
  bucketId: process.env.REPLIT_BUCKET_ID || 'replit-objstore-eb6fbb48-c0e4-4f0a-860c-88783397643d'
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/assets/:key', async (req, res) => {
    try {
      // Prefix the key with 'images/'
      const key = `images/${req.params.key}`;
      console.log(`Generating signed URL for key: ${key}`);

      const signedUrl = await objectStorage.createSignedUrl({
        key,
        expiresIn: 60 * 60, // 1 hour expiry
      });

      console.log(`Successfully generated signed URL for ${key}`);
      res.json({ url: signedUrl });
    } catch (error) {
      console.error('Failed to generate signed URL:', error);
      res.status(500).json({ error: 'Failed to generate signed URL' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}