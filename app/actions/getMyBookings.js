'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import checkAuth from './checkAuth';

async function getMyBookings() {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    // Get user's ID
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: 'You must be logged in to view bookings',
      };
    }

    // Fetch user's bookings (match bookRoom payload field names)
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_BOOKINGS,
      [Query.equal('userId', user.id)],
    );

    // Fetch room details for each booking
    const bookingsWithRooms = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const room = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_TABLES_Rooms,
            booking.room_id,
          );
          return {
            ...booking,
            room_name: room.name,
            room_description: room.description,
            room_location: room.location,
          };
        } catch (error) {
          console.log(`Failed to fetch room ${booking.room_id}:`, error);
          return {
            ...booking,
            room_name: 'Room not found',
            room_description: '',
            room_location: '',
          };
        }
      }),
    );

    return bookingsWithRooms;
  } catch (error) {
    console.log('Failed to get user bookings', error);
    redirect('/error');
  }
}

export default getMyBookings;
