import { useState, useRef } from 'react';
import { createParticipant } from '@/lib/api-client/participant';
import NameInputPopup from './NameInputPopup';
import { HiPlus } from 'react-icons/hi';
import { Participant } from '@/types/Participant';

interface ParticipantEditorProps {
  isEditing: boolean;
  setEditingParticipantName: (name: string) => void;
  getParticipantIdByName: (name: string) => string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: (isLoading: boolean) => void;
  eventId: string;
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onSaveAvailability: (participantId: string) => Promise<void>;
  onCancelEditing: () => void;
}

const ParticipantEditor: React.FC<ParticipantEditorProps> = ({
  isEditing,
  setEditingParticipantName,
  getParticipantIdByName,
  setIsEditing,
  setIsLoading,
  eventId,
  setParticipants,
  onSaveAvailability,
  onCancelEditing,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function openParticipantPopup() {
    buttonRef.current?.blur();
    setIsPopupOpen(true);
  }

  async function saveAvailabilities() {
    if (!editingParticipantId) return;
    buttonRef.current?.blur();
    setIsSubmitting(true);
    try {
      await onSaveAvailability(editingParticipantId);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateParticipant(name: string) {
    try {
      setIsLoading(true);
      setIsSubmitting(true);
      let createdParticipantId = '';

      // check if participant exists client side first
      // if participant does not exist create participant using API
      if (!(createdParticipantId = getParticipantIdByName(name))) {
        const result = await createParticipant(eventId, name);
        createdParticipantId = result.id;

        const createdParticipant: Participant = {
          id: createdParticipantId,
          name: name,
          availability: [],
        };
        setParticipants((prev) => [...prev, createdParticipant]);
      }

      setEditingParticipantName(name);
      setEditingParticipantId(createdParticipantId);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating participant:', error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-end w-full space-x-4">
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
      </div>
      {isPopupOpen && (
        <NameInputPopup onSubmit={handleCreateParticipant} onClose={() => setIsPopupOpen(false)} />
      )}
    </section>
  );
};

export default ParticipantEditor;
