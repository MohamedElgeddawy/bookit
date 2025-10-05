import Heading from '@/components/Heading';
export const dynamic = 'force-dynamic';
import getMyBookings from '@/app/actions/getMyBookings';
import BookingCard from '@/components/BookingCard';

const BookingsPage = async () => {
  const bookings = await getMyBookings();
  console.log(bookings);
  return (
    <div>
      <Heading title="Bookings" />
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <BookingCard key={booking.$id} booking={booking} />
        ))
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-4">
          <p className="text-gray-900 dark:text-white">You have no bookings</p>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
