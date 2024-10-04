interface CreateEventButtonProps {
  isSubmitting: boolean;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`bg-primary text-white text-xl text-center px-4 py-4 mt-8 mb-4 rounded-md w-full
        hover:bg-primaryHover focus:bg-primaryHover three-d ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
    >
      {isSubmitting ? 'イベントを作成中' : 'イベントを作成'}
    </button>
  );
};

export default CreateEventButton;
