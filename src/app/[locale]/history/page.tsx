import { FaRegTrashAlt } from 'react-icons/fa';

type Event = {
  id: string;
  title: string;
  dates: string[] | null;
  daysOfWeek: number[] | null;
  timeRangeStart: number;
  timeRangeEnd: number;
  numParticipants: number;
  createdAt: Date;
  url: string;
};

const events: Event[] = [
  {
    id: '1',
    title: 'Event 1',
    dates: ['4/1/2025', '4/2/2025', '4/3/2025'],
    daysOfWeek: null,
    timeRangeStart: 9,
    timeRangeEnd: 18,
    numParticipants: 16,
    createdAt: new Date(2025, 4, 1),
    url: 'http://hello.com',
  },
  {
    id: '2',
    title: 'Event 2',
    dates: ['4/1/2025', '4/2/2025', '4/3/2025'],
    daysOfWeek: null,
    timeRangeStart: 9,
    timeRangeEnd: 13,
    numParticipants: 1,
    createdAt: new Date(2025, 2, 5),
    url: 'http://hello.com',
  },
  {
    id: '3',
    title: 'Event 3',
    dates: ['4/1/2025', '4/2/2025', '4/3/2025'],
    daysOfWeek: null,
    timeRangeStart: 10,
    timeRangeEnd: 21,
    numParticipants: 12,
    createdAt: new Date(2025, 3, 25),
    url: 'http://hello.com',
  },
];

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="flex flex-col space-y-2 rounded border border-grayCustom p-3">
      <h2 className="text-lg font-medium">{event.title}</h2>
      <dl>
        <div className="flex space-x-1">
          <dt className="font-medium">Event dates:</dt>
          {event.dates && <dd>{event.dates.join(', ')}</dd>}
          {event.daysOfWeek && <dd>{event.daysOfWeek.join(', ')}</dd>}
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Event time:</dt>
          <dd>{`${event.timeRangeStart} - ${event.timeRangeEnd}`}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Number of participants:</dt>
          <dd>{event.numParticipants}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Created at:</dt>
          <dd>{event.createdAt.toDateString()}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Event URL:</dt>
          <dd>
            <a href={event.url} className="text-primary underline">
              {event.url}
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default function HistoryPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        View History
      </h1>
      <div className="w-full space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <button className="flex items-center space-x-2 rounded p-2 hover:bg-grayCustom">
        <FaRegTrashAlt />
        <p className="font-medium">Clear all view history</p>
      </button>
    </section>
  );
}
