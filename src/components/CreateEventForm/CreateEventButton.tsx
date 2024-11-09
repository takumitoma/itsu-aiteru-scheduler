interface CreateEventButtonProps {
  isSubmitting: boolean;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`three-d w-full mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isSubmitting ? 'イベントを作成中' : 'イベントを作成'}
    </button>
  );
};

export default CreateEventButton;
