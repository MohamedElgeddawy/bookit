'use server';
import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('appwrite-session');
  if (!session) {
    return { isAuthenticated: false };
  }
  try {
    const { account } = await createSessionClient(session.value);
    const user = await account.get();
    return {
      isAuthenticated: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    return { isAuthenticated: false, error: 'Error checking authentication' };
  }
}

export default checkAuth;
