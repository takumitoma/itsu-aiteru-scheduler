import CopyEventLink from './CopyEventLink';

const EventView: React.FC = () => {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-8">Event Title</h1>
      <CopyEventLink link="tempid-dsfnsdfosidnfsd-diandiasofna-dfdfsasdasniodnasdiasndfiasnfoiasnfsd" />
    </div>
  );
};

export default EventView;
