import { useState, useRef } from 'react';
import { createParticipant } from '@/lib/api-client/participant';
import { deleteParticipant } from '@/lib/api-client/participant';
import NameInputPopup from './NameInputPopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import { HiPlus } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import { Participant } from '@/types/Participant';

interface ParticipantEditorProps {
  mode: 'view' | 'edit' | 'delete';
  setMode: React.Dispatch<React.SetStateAction<'view' | 'edit' | 'delete'>>;
  participants: Participant[];
  editingParticipant: Participant | null;
  setEditingParticipant: (participant: Participant | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  eventId: string;
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  selectedParticipant: Participant | null;
  setSelectedParticipant: (participant: Participant | null) => void;
  onSaveAvailability: (participant: Participant) => Promise<void>;
  onCancelEditing: () => void;
  onLoadSelectedTimeSlots: (participant: Participant) => void;
}

const ParticipantEditor: React.FC<ParticipantEditorProps> = ({
  mode,
  setMode,
  editingParticipant,
  setEditingParticipant,
  setIsLoading,
  eventId,
  setParticipants,
  selectedParticipant,
  setSelectedParticipant,
  onSaveAvailability,
  onCancelEditing,
  onLoadSelectedTimeSlots,
  participants,
}) => {
  const [isNameInputPopupOpen, setIsNameInputPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addOrSaveButtonRef = useRef<HTMLButtonElement>(null);
  const cancelOrDeleteModeButtonRef = useRef<HTMLButtonElement>(null);

  function openNameInputPopup() {
    addOrSaveButtonRef.current?.blur();
    setIsNameInputPopupOpen(true);
  }

  function openConfirmDeletePopup() {
    setIsConfirmDeletePopupOpen(true);
  }

  async function saveAvailabilities() {
    if (!editingParticipant) return;
    addOrSaveButtonRef.current?.blur();
    setIsSubmitting(true);
    try {
      await onSaveAvailability(editingParticipant);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateParticipant(name: string) {
    try {
      setIsLoading(true);
      setIsSubmitting(true);

      // Check if participant exists client side first
      const existingParticipant = participants.find((p) => p.name === name);
      let createdParticipant: Participant;

      if (existingParticipant) {
        createdParticipant = existingParticipant;
      } else {
        // If participant does not exist, create participant using API
        const result = await createParticipant(eventId, name);
        createdParticipant = {
          id: result.id,
          name: name,
          availability: [],
        };
        setParticipants((prev) => [...prev, createdParticipant]);
      }

      setEditingParticipant(createdParticipant);
      setMode('edit');
      onLoadSelectedTimeSlots(createdParticipant);
    } catch (error) {
      console.error('Error creating participant:', error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }

  function handleCancelOrDeleteModeButtonClick() {
    cancelOrDeleteModeButtonRef.current?.blur();
    if (mode === 'edit') {
      setEditingParticipant(null);
      onCancelEditing();
    } else if (mode === 'view') {
      setSelectedParticipant(null);
      setMode('delete');
    } else if (mode === 'delete') {
      setSelectedParticipant(null);
      setMode('view');
    }
  }

  async function handleDeleteParticipant(participant: Participant | null): Promise<void> {
    if (!participant) return;
    try {
      setIsLoading(true);
      setIsSubmitting(true);
      // remove participant server side
      const result = await deleteParticipant(participant.id);

      if (result.success) {
        // if removal via server side successful, remove participant client side
        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p.id !== participant.id)
        );

        setSelectedParticipant(null);
        setMode('view');
        setIsConfirmDeletePopupOpen(false);
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
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
            onClick={mode === 'edit' ? saveAvailabilities : openNameInputPopup}
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
        {mode === 'delete' && selectedParticipant && (
          <button
            type="button"
            className="text-white bg-red-500 px-4 py-2 rounded-md flex-shrink-0 
            hover:brightness-90 w-[119px] sm:w-[135px] disabled:opacity-50
            disabled:cursor-not-allowed text-sm sm:text-lg"
            onClick={openConfirmDeletePopup}
          >
            削除
          </button>
        )}
        <button
          ref={cancelOrDeleteModeButtonRef}
          className="py-2 px-4 text-sm sm:text-lg text-red-500 bg-background border 
            border-red-500 rounded-md hover:bg-red-100 focus:bg-red-300 flex-shrink-0
            flex items-center space-x-2 w-[119px] sm:w-[135px] justify-center
            disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={handleCancelOrDeleteModeButtonClick}
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
      {isConfirmDeletePopupOpen && selectedParticipant && (
        <ConfirmDeletePopup
          participant={selectedParticipant}
          onSubmit={handleDeleteParticipant}
          onClose={() => setIsConfirmDeletePopupOpen(false)}
        />
      )}
    </section>
  );
};

export default ParticipantEditor;
