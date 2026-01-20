import { Client, Databases } from 'node-appwrite';
import type { Models } from 'node-appwrite'; 
import * as dotenv from 'dotenv';

dotenv.config();

async function testApiKey(): Promise<boolean> {
  try {
    const client = new Client()
      .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || '')
      .setProject(process.env.EXPO_PUBLIC_PROJECT_ID || '')
      .setKey(process.env.EXPO_PUBLIC_APPWRITE_API_KEY || '');

    const databases = new Databases(client);
    
    const response = await databases.list();
    
    console.log('✅ API Key is working!');
    console.log('Databases found:', response.databases.length);
    
    return true;
  } catch (error: any) {
    console.error('❌ API Key test failed:', error.message);
    
    if (error.code === 401) {
      console.error('Invalid API Key or insufficient permissions');
    } else if (error.code === 404) {
      console.error('Project not found or endpoint incorrect');
    } else if (error.code === 403) {
      console.error('Forbidden - check API key permissions');
    }
    
    return false;
  }
}

testApiKey().catch(console.error);