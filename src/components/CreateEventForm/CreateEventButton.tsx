interface CreateEventButtonProps {
  onClick: () => void;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="bg-primary text-white px-4 py-2 rounded-md h-11 max-w-md w-full
        hover:bg-primaryHover focus:bg-primaryHover"
    >
      イベントを作成
    </button>
  );
};

export default CreateEventButton;
