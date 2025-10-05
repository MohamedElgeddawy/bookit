'use server';
import { createAdminClient } from '@/config/appwrite';

async function testAppwrite() {
  try {
    console.log('Testing Appwrite connection...');
    console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
    console.log('Project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
    console.log('Database:', process.env.NEXT_PUBLIC_APPWRITE_DATABASE);
    console.log('Users Table:', process.env.NEXT_PUBLIC_APPWRITE_TABLES_Users);
    console.log('API Key exists:', !!process.env.APPWRITE_API_KEY);

    const { account, databases } = await createAdminClient();

    // Test account creation
    console.log('Testing account creation...');

    // Test database connection
    console.log('Testing database connection...');
    const databasesList = await databases.list();
    console.log(
      'Available databases:',
      databasesList.databases.map((db) => db.name),
    );

    return {
      success: true,
      message: 'Appwrite connection successful',
      databases: databasesList.databases.map((db) => db.name),
    };
  } catch (error) {
    console.log('Appwrite test error:', error);
    return {
      error: `Appwrite test failed: ${error.message}`,
      details: {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
        database: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
        usersTable: process.env.NEXT_PUBLIC_APPWRITE_TABLES_Users,
        hasApiKey: !!process.env.APPWRITE_API_KEY,
      },
    };
  }
}

export default testAppwrite;
