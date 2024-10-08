import { useState } from 'react';
import { EventData } from '@/types/EventData';
import WeekChart from './WeekChart';
import EditAvailabitiesButtons from './EditAvailabitiesButtons';
import CopyEventLink from './CopyEventLink';

interface ViewEventProps {
  eventData: EventData;
}

const ViewEvent: React.FC<ViewEventProps> = ({ eventData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const viewBoxes = {};

  return (
    <div className="container mx-auto flex flex-col items-center max-w-[762px] w-full">
      <h1 className="text-3xl font-bold">{eventData.title}</h1>
      <EditAvailabitiesButtons
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        id={eventData.id}
      />
      <WeekChart
        isEditing={isEditing}
        viewBoxes={viewBoxes}
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
