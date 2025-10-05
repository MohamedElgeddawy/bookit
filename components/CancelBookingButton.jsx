'use client';
import { toast } from 'react-toastify';
import cancelBooking from '@/app/actions/cancelBooking';

const CancelBookingButton = ({ bookingId }) => {
  const handleCancelBooking = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?',
    );
    if (confirmed) {
      try {
        const result = await cancelBooking(bookingId);
        if (result.success) {
          toast.success('Booking cancelled successfully!');
          window.location.reload();
        } else {
          toast.error(result.error || 'Failed to cancel booking');
        }
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  return (
    <button
      onClick={handleCancelBooking}
      className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
    >
      Cancel Booking
    </button>
  );
};

export default CancelBookingButton;
