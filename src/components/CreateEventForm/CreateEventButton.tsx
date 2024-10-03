interface CreateEventButtonProps {
  onClick: () => void;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="bg-primary text-white text-xl text-center px-4 py-4 mt-8 mb-4 rounded-md w-full
        hover:bg-primaryHover focus:bg-primaryHover"
    >
      イベントを作成
    </button>
  );
};

export default CreateEventButton;
