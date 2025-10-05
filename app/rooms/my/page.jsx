import Heading from '@/components/Heading';
export const dynamic = 'force-dynamic';
import MyRoomCard from '@/components/MyRoomCard';
import getMyRooms from '@/app/actions/getMyRooms';

const MyRoomsPage = async () => {
  const rooms = await getMyRooms();

  return (
    <>
      <Heading title="My Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <MyRoomCard key={room.$id} room={room} />)
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-4">
          <p className="text-gray-900 dark:text-white">
            You have no room listings
          </p>
        </div>
      )}
    </>
  );
};

export default MyRoomsPage;
