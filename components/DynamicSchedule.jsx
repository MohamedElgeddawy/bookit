'use client';
import { useState, useEffect } from 'react';
import checkRoomAvailability from '@/app/actions/checkRoomAvailability';

const DynamicSchedule = ({ room }) => {
  const [scheduleStatus, setScheduleStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Define time slots for checking availability
  const timeSlots = [
    { label: 'Morning', start: '09:00', end: '12:00' },
    { label: 'Afternoon', start: '12:00', end: '17:00' },
    { label: 'Evening', start: '17:00', end: '20:00' },
  ];

  useEffect(() => {
    const checkScheduleAvailability = async () => {
      setIsLoading(true);
      const status = {};

      try {
        const today = new Date().toISOString().split('T')[0];

        // Check availability for each time slot
        for (const slot of timeSlots) {
          const checkInDateTime = `${today}T${slot.start}:00Z`;
          const checkOutDateTime = `${today}T${slot.end}:00Z`;

          try {
            const isAvailable = await checkRoomAvailability(
              room.$id,
              checkInDateTime,
              checkOutDateTime,
            );
            status[slot.label] = {
              available: isAvailable,
              time: `${slot.start} - ${slot.end}`,
              status: isAvailable ? 'Available' : 'Booked',
            };
          } catch (error) {
            status[slot.label] = {
              available: false,
              time: `${slot.start} - ${slot.end}`,
              status: 'Unknown',
            };
          }
        }

        setScheduleStatus(status);
      } catch (error) {
        console.error('Error checking schedule availability:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkScheduleAvailability();
  }, [room.$id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-50';
      case 'Booked':
        return 'text-red-600 bg-red-50';
      case 'Unknown':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return '✅';
      case 'Booked':
        return '❌';
      case 'Unknown':
        return '❓';
      default:
        return '❓';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">Today's Schedule:</p>
        <div className="flex space-x-2">
          {timeSlots.map((slot) => (
            <div
              key={slot.label}
              className="px-3 py-2 bg-gray-100 rounded-md animate-pulse"
            >
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">Today's Schedule:</p>
      <div className="flex flex-wrap gap-2">
        {timeSlots.map((slot) => {
          const slotStatus = scheduleStatus[slot.label];
          return (
            <div
              key={slot.label}
              className={`px-3 py-2 rounded-md text-xs font-medium ${getStatusColor(
                slotStatus?.status,
              )}`}
            >
              <div className="flex items-center space-x-1">
                <span>{getStatusIcon(slotStatus?.status)}</span>
                <span className="font-semibold">{slot.label}</span>
              </div>
              <div className="text-xs opacity-75">{slotStatus?.time}</div>
              <div className="text-xs font-medium">{slotStatus?.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicSchedule;
