'use server';

import { createSessionClient } from '@/config/appwrite';

import { cookies } from 'next/headers';

async function destroySession() {
  // Retrieve session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get('appwrite-session');
  if (!session) {
    return { error: 'Session not found' };
  }

  try {
    // Destroy session using the session client
    const { account } = await createSessionClient(session.value);
    await account.deleteCurrentSession();

    // Delete current session cookie
    cookieStore.delete('appwrite-session');
    return { success: true, message: 'Session destroyed successfully' };
  } catch (error) {
    console.log('Error destroying session:', error);
    // Even if session deletion fails, remove the cookie
    cookieStore.delete('appwrite-session');
    return { success: true, message: 'Session destroyed successfully' };
  }
}

export default destroySession;
