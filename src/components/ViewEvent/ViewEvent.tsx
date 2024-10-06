import { EventData } from '@/types/EventData';
import WeekChart from './WeekChart';
import CopyEventLink from './CopyEventLink';

interface ViewEventProps {
  eventData: EventData;
}

const ViewEvent: React.FC<ViewEventProps> = ({ eventData }) => {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-8">{eventData.title}</h1>
      <WeekChart
        timezone={eventData.timezone}
        timeRangeStart={eventData.timeRangeStart}
        timeRangeEnd={eventData.timeRangeEnd}
        daysOfWeek={eventData.daysOfWeek}
      />
      <CopyEventLink link={`http://localhost:3000/${eventData.id}`} />
    </div>
  );
};

export default ViewEvent;
