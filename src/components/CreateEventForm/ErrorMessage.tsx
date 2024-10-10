interface ErrorProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-8">Error</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
