import { Client, TablesDB, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

    console.log('Database created:', database.$id);

    // 2. Create a table with columns based on CustomUser interface
    const table = await tablesDB.createTable({
      databaseId: database.$id,
      tableId: 'users',
      name: 'Users',
      columns: [
        {
          key: 'id',
          type: 'string',
          required: true,
          size: 255
        },
        {
          key: 'name',
          type: 'string',  
          required: true,
          size: 255
        },
        {
          key: 'email',
          type: 'string',  
          required: true,
          size: 255
        },
        {
          key: 'password',
          type: 'string', 
          required: true,
          size: 255
        },
        {
          key: 'role',
          type: 'string', 
          required: true,
          size: 50
        },
    
        {
          key: 'location',
          type: 'string',
          size:1000,
          default: JSON.stringify({})
        },
        {
          key: 'profilePicture',
          type: 'string',
          size:1000,
          default: JSON.stringify({})
        },
        {
          key: 'interests',
          type: 'string',
          size:2000,
           default: JSON.stringify([])

        },
        {
          key: 'stats',
          type: 'string',
          size:1000,
          default: JSON.stringify({})
        },
        
        {
          key: 'lastLoginAt',
          type: 'datetime',
          required: true
        },
        {
          key: 'loginCount',
          type: 'integer',
          required: true
        }
      ]
    });

    console.log('Table created with columns:', table.$id);
    

    console.log('Setup completed successfully!');

  } catch (error: any) {
    console.error('Setup failed:', error.message || error);
    console.error('Error details:', error.response || error);
  }
}

setupDatabase();