const NotFound = () => {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
      <h1 className="text-xl sm:text-3xl font-bold mb-8">イベントが見つかりません</h1>
      <p className="text-xs sm:text-xl">入力されたリンクが正しいかご確認ください。</p>
    </div>
  );
};

export default NotFound;
