import { Client } from '@replit/object-storage';

const storage = new Client({
  bucketId: 'replit-objstore-eb6fbb48-c0e4-4f0a-860c-88783397643d'
});

export async function getImageUrl(key: string) {
  try {
    return await storage.getSignedUrl('GET', key, 60 * 60); // URL valid for 1 hour
  } catch (error) {
    console.error('Failed to get signed URL:', error);
    throw error;
  }
}