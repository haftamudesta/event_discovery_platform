import { Client, Account,Avatars,Databases } from 'appwrite';

export const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1') 
  .setProject('695c09dd00314fa1333f'); 
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);