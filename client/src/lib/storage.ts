import { Client } from '@replit/object-storage';

const storage = new Client();

export async function getImageUrl(key: string) {
  try {
    return await storage.getSignedUrl('GET', key, 60 * 60); // URL valid for 1 hour
  } catch (error) {
    console.error('Failed to get signed URL:', error);
    throw error;
  }
}