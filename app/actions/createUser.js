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
    // Create Appwrite account
    const user = await account.create(ID.unique(), email, password, name);

    // Create user record in database
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_Users || 'users',
      ID.unique(),
      {
        name: name,
        email: email,
        userId: user.$id, // Link to Appwrite user ID
      },
    );

    return {
      success: true,
      message: 'User created successfully',
    };
  } catch (error) {
    console.log('Error creating user', error);

    // Check if it's a duplicate email error
    if (error.message && error.message.includes('user_already_exists')) {
      return {
        error:
          'User with this email already exists. Please try logging in instead.',
      };
    }

    return {
      error: 'Error creating user. Please try again.',
    };
  }
}

export default createUser;
