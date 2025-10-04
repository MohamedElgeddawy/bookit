'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { redirect } from 'next/navigation';
import checkAuth from './checkAuth';
import { revalidatePath } from 'next/cache';
import checkRoomAvailability from './checkRoomAvailability';

async function bookRoom(previousState, formData) {
  console.log(
    'bookRoom called with formData:',
    Object.fromEntries(formData.entries()),
  );
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) {
    return {
      error: 'You must be logged in to book a room',
    };
  }

  try {
    const { account, databases } = await createSessionClient(
      sessionCookie.value,
    );

    // Get user's ID
    const authResult = await checkAuth();

    if (!authResult.isAuthenticated) {
      return {
        error: 'You must be logged in to book a room',
      };
    }

    const user = authResult.user;

    // Extract date and time from form data
    const checkInDate = formData.get('check_in_date');
    const checkInTime = formData.get('check_in_time');
    const checkOutDate = formData.get('check_out_date');
    const checkOutTime = formData.get('check_out_time');

    // Convert date and time to Appwrite format
    const checkInDateTime = `${checkInDate}T${checkInTime}:00Z`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}:00Z`;

    const bookingData = {
      room_id: formData.get('room_id'),
      check_in: checkInDateTime,
      check_out: checkOutDateTime,
      userId: user.id,
    };

    console.log('Creating booking with data:', bookingData);

    // Check if the room is available BEFORE creating the booking
    const isAvailable = await checkRoomAvailability(
      formData.get('room_id'),
      checkInDateTime,
      checkOutDateTime,
    );

    if (!isAvailable) {
      return {
        error: 'Room is not available for the selected time period',
      };
    }

    // Create booking only if room is available
    const newBooking = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_BOOKINGS,
      ID.unique(),
      bookingData,
    );

    console.log('Booking created successfully:', newBooking);

    // Revalidate my bookings and all bookings
    revalidatePath('/bookings', 'layout');

    return {
      success: true,
      message: 'Room booked successfully',
    };
  } catch (error) {
    console.log('Failed to book room', error);
    return {
      error: 'Something went wrong',
    };
  }
}

export default bookRoom;
