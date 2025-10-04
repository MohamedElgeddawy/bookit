'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useActionState } from 'react';
import bookRoom from '@/app/actions/bookRoom';
import checkRoomAvailability from '@/app/actions/checkRoomAvailability';

const BookingForm = ({ room }) => {
  const [state, formAction] = useActionState(bookRoom, {});
  const router = useRouter();

  // Form state to preserve values on error
  const [formData, setFormData] = useState({
    check_in_date: '',
    check_in_time: '',
    check_out_date: '',
    check_out_time: '',
  });

  // Availability state
  const [availabilityStatus, setAvailabilityStatus] = useState({
    isChecking: false,
    isAvailable: null,
    message: '',
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      // Don't clear form on error - preserve user input
    }
    if (state.success) {
      toast.success(state.message || 'Room booked successfully!');
      router.push('/bookings');
    }
  }, [state, router]);

  // Check availability when form data changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (
        !formData.check_in_date ||
        !formData.check_in_time ||
        !formData.check_out_date ||
        !formData.check_out_time
      ) {
        setAvailabilityStatus({
          isChecking: false,
          isAvailable: null,
          message: '',
        });
        return;
      }

      setAvailabilityStatus({
        isChecking: true,
        isAvailable: null,
        message: 'Checking availability...',
      });

      try {
        const checkInDateTime = `${formData.check_in_date}T${formData.check_in_time}:00Z`;
        const checkOutDateTime = `${formData.check_out_date}T${formData.check_out_time}:00Z`;

        const isAvailable = await checkRoomAvailability(
          room.$id,
          checkInDateTime,
          checkOutDateTime,
        );

        setAvailabilityStatus({
          isChecking: false,
          isAvailable: isAvailable,
          message: isAvailable
            ? 'Room is available!'
            : 'Room is not available for selected time',
        });
      } catch (error) {
        setAvailabilityStatus({
          isChecking: false,
          isAvailable: false,
          message: 'Error checking availability',
        });
      }
    };

    // Debounce the availability check
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, room.$id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAvailabilityColor = () => {
    if (availabilityStatus.isChecking) return 'text-blue-600';
    if (availabilityStatus.isAvailable === true) return 'text-green-600';
    if (availabilityStatus.isAvailable === false) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Book this Room</h2>

      {/* Availability Status */}
      {availabilityStatus.message && (
        <div
          className={`mt-2 p-3 rounded-md ${
            availabilityStatus.isAvailable === true
              ? 'bg-green-50 border border-green-200'
              : availabilityStatus.isAvailable === false
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <p className={`text-sm font-medium ${getAvailabilityColor()}`}>
            {availabilityStatus.isChecking && '⏳ '}
            {availabilityStatus.isAvailable === true && '✅ '}
            {availabilityStatus.isAvailable === false && '❌ '}
            {availabilityStatus.message}
          </p>
        </div>
      )}

      <form action={formAction} className="mt-4">
        <input type="hidden" name="room_id" value={room.$id} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="check_in_date"
              className="block text-sm font-medium text-gray-700"
            >
              Check-In Date
            </label>
            <input
              type="date"
              id="check_in_date"
              name="check_in_date"
              value={formData.check_in_date}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="check_in_time"
              className="block text-sm font-medium text-gray-700"
            >
              Check-In Time
            </label>
            <input
              type="time"
              id="check_in_time"
              name="check_in_time"
              value={formData.check_in_time}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="check_out_date"
              className="block text-sm font-medium text-gray-700"
            >
              Check-Out Date
            </label>
            <input
              type="date"
              id="check_out_date"
              name="check_out_date"
              value={formData.check_out_date}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="check_out_time"
              className="block text-sm font-medium text-gray-700"
            >
              Check-Out Time
            </label>
            <input
              type="time"
              id="check_out_time"
              name="check_out_time"
              value={formData.check_out_time}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={
              availabilityStatus.isAvailable === false ||
              availabilityStatus.isChecking
            }
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              availabilityStatus.isAvailable === false ||
              availabilityStatus.isChecking
                ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-400'
                : 'bg-black hover:bg-gray-700 focus:ring-gray-800'
            }`}
          >
            {availabilityStatus.isChecking ? 'Checking...' : 'Book Room'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
