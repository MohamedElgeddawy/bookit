'use server';
import { createAdminClient } from '@/config/appwrite';
import { ID } from 'node-appwrite';

async function createUser(previousState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  if (!name || !email || !password) {
    return {
      error: 'Please fill out all fields',
    };
  }
  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters long',
    };
  }
  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  // Get account and databases instance
  const { account, databases } = await createAdminClient();

  try {
    console.log('Creating user with email:', email);
    console.log('Database:', process.env.NEXT_PUBLIC_APPWRITE_DATABASE);
    console.log('Users table:', process.env.NEXT_PUBLIC_APPWRITE_TABLES_Users);

    // Create Appwrite account first
    const user = await account.create(ID.unique(), email, password, name);
    console.log('Appwrite user created:', user.$id);

    // Try to create user record in database
    try {
      const userRecord = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
        process.env.NEXT_PUBLIC_APPWRITE_TABLES_Users || 'users',
        ID.unique(),
        {
          name: name,
          email: email,
          userId: user.$id, // Link to Appwrite user ID
        },
      );
      console.log('Database user record created:', userRecord.$id);
    } catch (dbError) {
      console.log('Database error (non-critical):', dbError);
      // If database creation fails, we still have the Appwrite account
      // This allows the user to login even if the database record creation fails
    }

    return {
      success: true,
      message: 'User created successfully',
    };
  } catch (error) {
    console.log('Error creating user:', error);
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);

    // Check if it's a duplicate email error
    if (error.message && error.message.includes('user_already_exists')) {
      return {
        error:
          'User with this email already exists. Please try logging in instead.',
      };
    }

    // Check for specific Appwrite errors
    if (error.code === 409) {
      return {
        error:
          'User with this email already exists. Please try logging in instead.',
      };
    }

    if (error.code === 400) {
      return {
        error: 'Invalid email or password format. Please check your input.',
      };
    }

    if (error.code === 401) {
      return {
        error:
          'Authentication failed. Please check your Appwrite configuration.',
      };
    }

    if (error.code === 404) {
      return {
        error:
          'Database or collection not found. Please check your configuration.',
      };
    }

    return {
      error: `Error creating user: ${error.message || 'Unknown error'}`,
    };
  }
}

export default createUser;
