import { Client, Account,Avatars,Databases } from 'appwrite';

export const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1') 
  .setProject('6957611c00245d7a12cf'); 
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);