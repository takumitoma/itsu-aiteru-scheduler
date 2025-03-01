import { EventHistory } from '@/components/EventHistory';

export default function HistoryPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        View History
      </h1>
      <EventHistory />
    </section>
  );
}
