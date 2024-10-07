import { useRef } from 'react';

interface EditAvailabitiesButtonsProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditAvailabitiesButtons: React.FC<EditAvailabitiesButtonsProps> = ({
  isEditing,
  setIsEditing,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggleIsEditing() {
    buttonRef.current?.blur();
    setIsEditing((prev) => !prev);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  return (
    <div className="flex items-center w-full justify-between my-8">
      <button
        className={`py-2 px-4 text-sm sm:text-lg text-red-500 bg-background border 
          border-red-500 rounded-md hover:bg-red-100 focus:bg-red-300 flex-shrink-0 ${
            isEditing ? '' : 'invisible'
          }`}
        type="button"
        onClick={cancelEditing}
      >
        <p className="select-none">キャンセル</p>
      </button>
      <button
        ref={buttonRef}
        className="py-2 px-4 text-sm sm:text-lg text-white bg-primary rounded-md 
          border border-primary hover:bg-primaryHover focus:bg-primaryHover 
          shadow-sm flex-shrink-0 w-[132px] sm:w-[160px]"
        type="button"
        onClick={toggleIsEditing}
      >
        <p className="select-none">{isEditing ? '保存' : '空き時間を追加'}</p>
      </button>
    </div>
  );
};

export default EditAvailabitiesButtons;
