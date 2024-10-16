import { useState, useRef } from 'react';
import { createParticipant } from '@/lib/api-client/participant';
import NameInputPopup from './NameInputPopup';
import { HiPlus } from 'react-icons/hi';

interface ParticipantEditorProps {
  isEditing: boolean;
  setParticipantName: (name: string) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: (isLoading: boolean) => void;
  eventId: string;
  onSaveAvailability: (participantId: string) => Promise<void>;
  onCancelEditing: () => void;
}

const ParticipantEditor: React.FC<ParticipantEditorProps> = ({
  isEditing,
  setParticipantName,
  setIsEditing,
  setIsLoading,
  eventId,
  onSaveAvailability,
  onCancelEditing,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function openParticipantPopup() {
    buttonRef.current?.blur();
    setIsPopupOpen(true);
  }

  async function saveAvailabilities() {
    if (!participantId) return;
    buttonRef.current?.blur();
    setIsSubmitting(true);
    try {
      await onSaveAvailability(participantId);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateParticipant(name: string) {
    try {
      setIsLoading(true);
      setIsSubmitting(true);
      const { id: createdParticipantId } = await createParticipant(eventId, name);
      setParticipantName(name);
      setParticipantId(createdParticipantId);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating participant:', error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col w-full space-y-4 py-4">
      <div
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-start sm:items-center 
          w-full justify-between"
      >
        <div className={`flex items-center ${isEditing ? 'space-x-4' : ''}`}>
          {isEditing && (
            <button
              className="py-2 px-4 text-sm sm:text-lg text-red-500 bg-background border 
                border-red-500 rounded-md hover:bg-red-100 focus:bg-red-300 flex-shrink-0
                disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={onCancelEditing}
              disabled={isSubmitting}
            >
              キャンセル
            </button>
          )}
          <button
            ref={buttonRef}
            className="py-2 px-4 text-sm sm:text-lg text-white bg-primary rounded-md border 
              border-primary hover:bg-primaryHover focus:bg-primaryHover shadow-sm flex-shrink-0 
              flex items-center space-x-2 w-[118px] sm:w-[134px] justify-center
              disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={isEditing ? saveAvailabilities : openParticipantPopup}
            disabled={isSubmitting}
          >
            {!isEditing && <HiPlus size={20} />}
            <p>{isEditing ? '保存' : '空き時間'}</p>
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <NameInputPopup onSubmit={handleCreateParticipant} onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
};

export default ParticipantEditor;
