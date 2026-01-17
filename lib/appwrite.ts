import { Client, Account,Avatars,Databases } from 'appwrite';

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) 
  .setProject(process.env.EXPO_PUBLIC_PROJECT_ID!); 
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);