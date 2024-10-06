const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-5rem)] flex-col space-y-4">
      <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold">404</h1>
      <h2 className="text-md sm:text-lg md:text-2xl font-bold">
        お探しのページは見つかりませんでした。
      </h2>
    </div>
  );
};

export default NotFound;
