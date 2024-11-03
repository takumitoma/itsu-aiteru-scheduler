import CreateEventForm from '@/components/CreateEventForm/CreateEventForm';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-8">
      <h1>新規イベント作成</h1>
      <CreateEventForm />
    </div>
  );
};

export default Home;
