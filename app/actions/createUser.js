'use server'
import { createAdminClient } from '@/config/appwrite';
import { ID }  from 'node-appwrite';

async function createUser(previousState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');
  if(!name || !email || !password) {
    return {
        error: 'Please fill out all fields',
    };
  }
  if(password.length < 8) {
    return {
        error: 'Password must be at least 8 characters long',
    };
  }
  if(password !== confirmPassword) {
    return {
        error: 'Passwords do not match',
    };
  }

  // Get account instance
  const { account } = await createAdminClient();
  try {
    const user = await account.create(ID.unique(), email, password, name);
    return {
        success: true,
        message: 'User created successfully',
    };
  } catch (error) {
    console.log('Error creating user', error);
    return {
        error: 'Error creating user',
    };
  }
}

export default createUser;