import { Client, TablesDB, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';



// Load .env from the parent directory ES modules
// const envPath = path.join(__dirname, '..', '.env');
// console.log('Loading .env from:', envPath);
// dotenv.config({ path: envPath });


// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });



const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || '') 
  .setProject(process.env.EXPO_PUBLIC_PROJECT_ID || '')
  .setKey(process.env.EXPO_PUBLIC_APPWRITE_API_KEY || ''); 

const tablesDB = new TablesDB(client);

async function setupDatabase() {
  try {
    // 1. Create a database
    const database = await tablesDB.create({
        databaseId: ID.unique(),
      name: 'UserDatabase',
    });

    // 2. Create a table within the database
    const table = await tablesDB.createTable({
      databaseId: database.$id,
      tableId: ID.unique(), 
      name: 'Users',
    });

    console.log('Setup completed successfully!');

  } 
  catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();