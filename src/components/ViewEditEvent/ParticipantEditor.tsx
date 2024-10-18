import { useState, useRef } from 'react';
import { createParticipant } from '@/lib/api-client/participant';
import NameInputPopup from './NameInputPopup';
import { HiPlus } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
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
  onLoadSelectedTimeSlots: (participantName: string) => void;
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
  onLoadSelectedTimeSlots,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const addOrSaveButtonRef = useRef<HTMLButtonElement>(null);
  const deleteOrCancelButtonRef = useRef<HTMLButtonElement>(null);

  function openParticipantPopup() {
    addOrSaveButtonRef.current?.blur();
    setIsPopupOpen(true);
  }

  async function saveAvailabilities() {
    if (!editingParticipantId) return;
    addOrSaveButtonRef.current?.blur();
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
      onLoadSelectedTimeSlots(name);
    } catch (error) {
      console.error('Error creating participant:', error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }

  async function handleDeleteParticipant() {
    deleteOrCancelButtonRef.current?.blur();
    setIsDeleting(true);
    //todo try catch api
    setIsDeleting(false);
  }

  function handleCancelEditing() {
    deleteOrCancelButtonRef.current?.blur();
    onCancelEditing();
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-end w-full space-x-4">
        <button
          ref={addOrSaveButtonRef}
          className="py-2 px-4 text-sm sm:text-lg text-white bg-primary rounded-md border 
            border-primary hover:bg-primaryHover focus:bg-primaryHover shadow-sm flex-shrink-0 
            flex items-center space-x-2 w-[118px] sm:w-[134px] justify-center
            disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={isEditing ? saveAvailabilities : openParticipantPopup}
          disabled={isSubmitting || isDeleting}
        >
          {isEditing ? (
            <p>保存</p>
          ) : (
            <>
              <HiPlus size={20} />
              <p>空き時間</p>
            </>
          )}
        </button>
        <button
          ref={deleteOrCancelButtonRef}
          className="py-2 px-4 text-sm sm:text-lg text-red-500 bg-background border 
            border-red-500 rounded-md hover:bg-red-100 focus:bg-red-300 flex-shrink-0
            flex items-center space-x-2 w-[118px] sm:w-[134px] justify-center
            disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={isEditing ? handleCancelEditing : handleDeleteParticipant}
          disabled={isSubmitting || isDeleting}
        >
          {isEditing ? (
            <p>キャンセル</p>
          ) : (
            <>
              <FaTrash size={20} />
              <p>空き時間</p>
            </>
          )}
        </button>
      </div>
      {isPopupOpen && (
        <NameInputPopup onSubmit={handleCreateParticipant} onClose={() => setIsPopupOpen(false)} />
      )}
    </section>
  );
};

export default ParticipantEditor;
