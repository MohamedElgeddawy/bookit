import RoomCard from '@/components/RoomCard';
import Heading from '@/components/Heading';
import getAllRooms from './actions/getAllRooms';

export default async function Home() {
  const rooms = await getAllRooms();
  return (
    <>
      <Heading title="Available Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard key={room.$id} room={room} />)
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            No rooms available at the moment
          </h2>
        </div>
      )}
    </>
  );
}
