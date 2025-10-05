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
    console.log('Attempting login for email:', email);

    // Try to create session directly with Appwrite first
    const session = await account.createEmailPasswordSession(email, password);
    console.log('Session created successfully:', session.$id);

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
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);

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

    // Check for specific Appwrite error codes
    if (error.code === 401) {
      return {
        error: 'Invalid email or password. Please check your credentials.',
      };
    }

    if (error.code === 404) {
      return {
        error: 'User not found. Please register first.',
        redirectToRegister: true,
      };
    }

    return {
      error: `Login failed: ${error.message || 'Unknown error'}`,
    };
  }
}

export default createSession;
