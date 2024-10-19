import { useState, useRef } from 'react';
import { createParticipant } from '@/lib/api-client/participant';
import NameInputPopup from './NameInputPopup';
import { HiPlus } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import { Participant } from '@/types/Participant';

interface ParticipantEditorProps {
  mode: 'view' | 'edit' | 'delete';
  setMode: React.Dispatch<React.SetStateAction<'view' | 'edit' | 'delete'>>;
  setEditingParticipantName: (name: string) => void;
  getParticipantIdByName: (name: string) => string;
  setIsLoading: (isLoading: boolean) => void;
  eventId: string;
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onSaveAvailability: (participantId: string) => Promise<void>;
  onCancelEditing: () => void;
  onLoadSelectedTimeSlots: (participantName: string) => void;
}

const ParticipantEditor: React.FC<ParticipantEditorProps> = ({
  mode,
  setMode,
  setEditingParticipantName,
  getParticipantIdByName,
  setIsLoading,
  eventId,
  setParticipants,
  onSaveAvailability,
  onCancelEditing,
  onLoadSelectedTimeSlots,
}) => {
  const [isNameInputPopupOpen, setIsNameInputPopupOpen] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addOrSaveButtonRef = useRef<HTMLButtonElement>(null);
  const deleteOrCancelButtonRef = useRef<HTMLButtonElement>(null);

  function openParticipantPopup() {
    addOrSaveButtonRef.current?.blur();
    setIsNameInputPopupOpen(true);
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
      setMode('edit');
      onLoadSelectedTimeSlots(name);
    } catch (error) {
      console.error('Error creating participant:', error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }

  function handleCancelOrDeleteButtonClick() {
    deleteOrCancelButtonRef.current?.blur();
    if (mode === 'edit') {
      handleCancelEditing();
    } else if (mode === 'view') {
      setMode('delete');
    } else if (mode === 'delete') {
      setMode('view');
    }
  }

  function handleCancelEditing() {
    deleteOrCancelButtonRef.current?.blur();
    onCancelEditing();
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-end w-full space-x-4">
        {mode !== 'delete' && (
          <button
            ref={addOrSaveButtonRef}
            className="py-2 px-4 text-sm sm:text-lg text-white bg-primary rounded-md border 
              border-primary hover:bg-primaryHover focus:bg-primaryHover shadow-sm flex-shrink-0 
              flex items-center space-x-2 w-[119px] sm:w-[135px] justify-center
              disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={mode === 'edit' ? saveAvailabilities : openParticipantPopup}
            disabled={isSubmitting}
          >
            {mode === 'edit' ? (
              <p>保存</p>
            ) : (
              <>
                <HiPlus size={20} />
                <p>空き時間</p>
              </>
            )}
          </button>
        )}
        <button
          ref={deleteOrCancelButtonRef}
          className="py-2 px-4 text-sm sm:text-lg text-red-500 bg-background border 
            border-red-500 rounded-md hover:bg-red-100 focus:bg-red-300 flex-shrink-0
            flex items-center space-x-2 w-[119px] sm:w-[135px] justify-center
            disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={handleCancelOrDeleteButtonClick}
          disabled={isSubmitting}
        >
          {mode === 'edit' || mode === 'delete' ? (
            <p>キャンセル</p>
          ) : (
            <>
              <FaTrash size={20} />
              <p>空き時間</p>
            </>
          )}
        </button>
      </div>
      {isNameInputPopupOpen && (
        <NameInputPopup
          onSubmit={handleCreateParticipant}
          onClose={() => setIsNameInputPopupOpen(false)}
        />
      )}
    </section>
  );
};

export default ParticipantEditor;
