'use client';

import CreateEventButton from '@/components/CreateEventButton';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">新規イベント作成</h1>
      <CreateEventButton onClick={() => {}} />
    </div>
  );
};

export default Home;
