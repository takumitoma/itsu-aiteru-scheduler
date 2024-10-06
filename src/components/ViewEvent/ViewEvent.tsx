import CopyEventLink from './CopyEventLink';

interface EventData {
  id: string;
  title: string;
  surveyType: 'specific' | 'week';
  timezone: string;
  timeRangeStart: string;
  timeRangeEnd: string;
  dates: string[] | null;
  daysOfWeek: number[] | null;
}

interface ViewEventProps {
  eventData: EventData;
}

const ViewEvent: React.FC<ViewEventProps> = ({ eventData }) => {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-8">{eventData.title}</h1>
      <CopyEventLink link={`${window.location.origin}/${eventData.id}`} />
    </div>
  );
};

export default ViewEvent;
