'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { DateTime } from 'luxon';

// Convert a date to a luxon datetime object
const convertToLuxonDateTime = (date) => {
  return DateTime.fromISO(date, { zone: 'UTC' });
};

// Check for if there is an overlap between two dates
const checkForOverlap = (
  checkIn,
  checkOut,
  bookingCheckIn,
  bookingCheckOut,
) => {
  return checkIn < bookingCheckOut && checkOut > bookingCheckIn;
};

async function checkRoomAvailability(roomId, checkIn, checkOut) {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { account, databases } = await createSessionClient(
      sessionCookie.value,
    );

    // Check if the room is available
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_TABLES_BOOKINGS,
      [Query.equal('room_id', roomId)],
    );

    // loop through bookings and check if the room is available
    const isAvailable = bookings.every((booking) => {
      const bookingCheckIn = convertToLuxonDateTime(booking.check_in);
      const bookingCheckOut = convertToLuxonDateTime(booking.check_out);
      return !checkForOverlap(
        convertToLuxonDateTime(checkIn),
        convertToLuxonDateTime(checkOut),
        bookingCheckIn,
        bookingCheckOut,
      );
    });

    return isAvailable; // Return true if available, false if not
  } catch (error) {
    console.log('Failed to check room availability', error);
    return false; // Return false on error (assume not available)
  }
}

export default checkRoomAvailability;
