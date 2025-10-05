import Image from 'next/image';
import Link from 'next/link';
import Heading from '@/components/Heading';
import { FaChevronLeft } from 'react-icons/fa';
import BookingForm from '@/components/BookingForm';
import getSingleRoom from '@/app/actions/getSingleRoom';
import DynamicSchedule from '@/components/DynamicSchedule';

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

const RoomPage = async ({ params }) => {
  const { id: roomId } = await params;
  const room = await getSingleRoom(roomId);

  console.log(room);

  if (!room) {
    return <Heading title="Room not found" />;
  }

  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  // Import the room image dynamically
  const getRoomImage = (imageName) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageName}/view?project=${projectId}`;
  };

  const imageSrc = room.image
    ? getRoomImage(room.image)
    : '/assets/images/rooms/default.jpg';

  return (
    <>
      <Heading title={room.name} />
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
        >
          <FaChevronLeft className="w-4 h-4 mr-2" />
          <span>Back to Rooms</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <Image
            src={imageSrc}
            alt={room.name}
            width={400}
            height={300}
            className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="mt-4 sm:mt-0 sm:flex-1">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {room.description}
            </p>

            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Size:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {room.sqft} sq ft
                </span>
              </li>
              <li>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Capacity:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {room.capacity} people
                </span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Schedule:
                </span>
                <DynamicSchedule room={room} />
              </li>
              <li>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Price:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  ${room.price_per_hour}/hour
                </span>
              </li>
              <li>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Location:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {room.location}
                </span>
              </li>
              <li>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Address:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {room.address}
                </span>
              </li>
              <li>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Amenities:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-300">
                  {room.amenities}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <BookingForm room={room} />
      </div>
    </>
  );
};

export default RoomPage;
