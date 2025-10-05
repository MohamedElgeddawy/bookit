'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import checkRoomAvailability from '@/app/actions/checkRoomAvailability';
import DynamicSchedule from './DynamicSchedule';

const RoomCard = ({ room }) => {
  const [availabilityStatus, setAvailabilityStatus] = useState({
    isChecking: false,
    isAvailable: null,
    message: '',
  });

  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  // Import the room image dynamically
  const getRoomImage = (imageName) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageName}/view?project=${projectId}`;
  };

  const imageSrc = room.image
    ? getRoomImage(room.image)
    : '/assets/images/rooms/default.jpg';

  // Check availability for today's business hours (9 AM - 5 PM)
  useEffect(() => {
    const checkTodayAvailability = async () => {
      setAvailabilityStatus({
        isChecking: true,
        isAvailable: null,
        message: 'Checking availability...',
      });

      try {
        const today = new Date().toISOString().split('T')[0];
        const checkInDateTime = `${today}T09:00:00Z`;
        const checkOutDateTime = `${today}T17:00:00Z`;

        const isAvailable = await checkRoomAvailability(
          room.$id,
          checkInDateTime,
          checkOutDateTime,
        );

        setAvailabilityStatus({
          isChecking: false,
          isAvailable: isAvailable,
          message: isAvailable ? 'Available today' : 'Not available today',
        });
      } catch (error) {
        setAvailabilityStatus({
          isChecking: false,
          isAvailable: false,
          message: 'Check availability',
        });
      }
    };

    checkTodayAvailability();
  }, [room.$id]);

  const getAvailabilityColor = () => {
    if (availabilityStatus.isChecking) return 'text-blue-600';
    if (availabilityStatus.isAvailable === true) return 'text-green-600';
    if (availabilityStatus.isAvailable === false) return 'text-red-600';
    return 'text-gray-600';
  };

  const getAvailabilityIcon = () => {
    if (availabilityStatus.isChecking) return '⏳';
    if (availabilityStatus.isAvailable === true) return '✅';
    if (availabilityStatus.isAvailable === false) return '❌';
    return 'ℹ️';
  };

  // Format schedule text to be more user-friendly
  const formatSchedule = (schedule) => {
    if (!schedule) return 'Schedule not specified';

    // Fix common typos and format the schedule
    let formattedSchedule = schedule
      .replace(/moday/gi, 'Monday')
      .replace(/tuesday/gi, 'Tuesday')
      .replace(/wednesday/gi, 'Wednesday')
      .replace(/thursday/gi, 'Thursday')
      .replace(/friday/gi, 'Friday')
      .replace(/saturday/gi, 'Saturday')
      .replace(/sunday/gi, 'Sunday')
      .replace(/am/gi, 'AM')
      .replace(/pm/gi, 'PM');

    // Add proper spacing and formatting
    formattedSchedule = formattedSchedule
      .replace(/(\d+)(am|pm)/gi, '$1 $2')
      .replace(/(\d+)(AM|PM)/gi, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    return formattedSchedule;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <Image
          src={imageSrc}
          alt={room.name}
          width={128}
          height={128}
          className="w-full sm:w-32 sm:h-32 mb-3 sm:mb-0 object-cover rounded-lg"
        />
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {room.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Address:
            </span>{' '}
            {room.address}
          </p>
          <DynamicSchedule room={room} />
          <p className={`text-sm font-medium ${getAvailabilityColor()}`}>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Overall Status:
            </span>{' '}
            {getAvailabilityIcon()} {availabilityStatus.message}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Price:
            </span>{' '}
            ${room.price_per_hour}/hour
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
        <Link
          href={`/rooms/${room.$id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
        >
          View Room
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
