'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import createRoom from '@/app/actions/createRoom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { toast } from 'react-toastify';
import Heading from '@/components/Heading';

const AddRoomPage = () => {
  const [state, formAction] = useActionState(createRoom, {});
  const router = useRouter();

  useEffect(() => {
    console.log('AddRoomPage state changed:', state);
    if (state.success) {
      toast.success(state.message || 'Room created successfully!');
      router.push('/');
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <>
      <Heading title="Add Room" />
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full">
        <form action={formAction}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Room Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter a name (Large Conference Room)"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="border border-gray-300 dark:border-gray-600 rounded w-full h-24 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter a description for the room"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="sqft"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Square Feet
            </label>
            <input
              type="number"
              id="sqft"
              name="sqft"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter room size in ft"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="capacity"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Number of people the room can hold"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price_per_hour"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Price Per Hour
            </label>
            <input
              type="number"
              id="price_per_hour"
              name="price_per_hour"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter price per hour"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter full address"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Location (Building, Floor, Room)"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="availability"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Availability
            </label>
            <input
              type="text"
              id="availability"
              name="availability"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Availability (Monday - Friday, 9am - 5pm)"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="amenities"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Amenities
            </label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Amenities CSV (projector, whiteboard, etc.)"
              required
            />
          </div>

          {/* <!-- Image Upload --> */}
          <div className="mb-8">
            <label
              htmlFor="image"
              className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
            >
              Image
            </label>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="submit"
              className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
              disabled={state.loading}
            >
              {state.loading ? 'Creating...' : 'Save'}
            </button>

            {state.error && (
              <div className="text-red-600 dark:text-red-400 text-sm mt-2">
                {state.error}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRoomPage;
