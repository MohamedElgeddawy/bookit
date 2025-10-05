'use server';
import { createAdminClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';

async function createSession(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return {
      error: 'Please fill out all fields',
    };
  }

  // Get account and databases instance
  const { account, databases } = await createAdminClient();

  try {
    // First, check if user exists in our database
    const { documents: users } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_Users || 'users',
      [Query.equal('email', email)],
    );

    if (users.length === 0) {
      return {
        error: 'User not found. Please register first.',
        redirectToRegister: true,
      };
    }

    // Generate session
    const session = await account.createEmailPasswordSession(email, password);

    // Create cookie
    const cookieStore = await cookies();
    cookieStore.set('appwrite-session', session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(session.expire),
      path: '/',
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log('Authentication Error: ', error);

    // Check if it's a user not found error
    if (error.message && error.message.includes('user_not_found')) {
      return {
        error: 'User not found. Please register first.',
        redirectToRegister: true,
      };
    }

    // Check if it's an invalid password error
    if (error.message && error.message.includes('invalid_password')) {
      return {
        error: 'Invalid password. Please check your password.',
      };
    }

    return {
      error: 'Invalid credentials. Please check your email and password.',
    };
  }
}

export default createSession;
