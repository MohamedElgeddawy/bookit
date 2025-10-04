'use client';

import React from 'react';
import Link from 'next/link';
import CancelBookingButton from './CancelBookingButton';

const BookingCard = ({ booking }) => {
  const { $id, room_id, check_in, check_out, room_name, room_location } =
    booking;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleString('default', { timeStyle: 'short' });
    return { month, day, year, time };
  };

  const checkIn = formatDate(check_in);
  const checkOut = formatDate(check_out);

  return (
    <div className="bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h4 className="text-lg font-semibold">{room_name}</h4>
        {room_location && (
          <p className="text-sm text-gray-500 mb-2">
            <strong>Location:</strong> {room_location}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <strong>Check In:</strong> {checkIn.month} {checkIn.day},{' '}
          {checkIn.year} {checkIn.time}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check Out:</strong> {checkOut.month} {checkOut.day},{' '}
          {checkOut.year} {checkOut.time}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
        <Link
          href={`/rooms/${room_id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
        >
          View Room
        </Link>
        <CancelBookingButton bookingId={$id} />
      </div>
    </div>
  );
};

export default BookingCard;
