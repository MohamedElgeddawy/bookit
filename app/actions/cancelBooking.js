'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import checkAuth from './checkAuth';

async function cancelBooking(bookingId) {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    // Get user's ID
    const authResult = await checkAuth();

    if (!authResult.isAuthenticated) {
      return {
        error: 'You must be logged in to cancel a booking',
      };
    }
    // Get the booking
    const booking = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_BOOKINGS,
      bookingId,
    );

    // Check if the booking exists
    if (!booking) {
      return {
        error: 'Booking not found',
      };
    }

    // Check if the booking belongs to the user
    if (booking.userId !== authResult.user.id) {
      return {
        error: 'You are not authorized to cancel this booking',
      };
    }

    // Delete the booking
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_BOOKINGS,
      bookingId,
    );

    // Revalidate my bookings and all bookings
    revalidatePath('/bookings', 'layout');

    return {
      success: true,
    };
  } catch (error) {
    console.log('Failed to cancel booking', error);
    return {
      error: 'Failed to cancel booking',
    };
  }
}

export default cancelBooking;
