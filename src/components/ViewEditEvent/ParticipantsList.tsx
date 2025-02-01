import { useRef } from 'react';
import { Participant } from '@/types/Participant';
import { useTranslations } from 'next-intl';

interface ParticipantsListProps {
  mode: 'view' | 'edit' | 'delete';
  allParticipants: Participant[];
  selectedParticipant: Participant | null;
  setSelectedParticipant: React.Dispatch<React.SetStateAction<Participant | null>>;
  setSelectedColorScaleIndex: (index: number | null) => void;
}

export function ParticipantsList({
  mode,
  allParticipants,
  selectedParticipant,
  setSelectedParticipant,
  setSelectedColorScaleIndex,
}: ParticipantsListProps) {
  const t = useTranslations('ViewEditEvent.ParticipantsList');
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleClick(participant: Participant, index: number) {
    setSelectedColorScaleIndex(null);
    setSelectedParticipant((prevParticipant) => {
      if (prevParticipant?.id === participant.id) {
        return null;
      }
      return participant;
    });
    buttonRefs.current[index]?.blur();
  }

  return (
    <section className="w-full space-y-2">
      <h2>
        {t('participantCount')} {allParticipants.length}
      </h2>
      <p className="text-xs text-gray-600 sm:text-sm">
        {mode === 'view' ? t('viewModeHelp') : t('deleteModeHelp')}
      </p>
      <ul className="flex flex-wrap gap-2 text-sm sm:text-lg">
        {allParticipants.map((participant, index) => (
          <li key={`participant-${participant.id}`}>
            <button
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              className={
                `rounded border px-2 py-1 hover:border-primary hover:opacity-100 ` +
                `focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedParticipant?.id === participant.id
                    ? 'border-2 border-primary font-bold opacity-100'
                    : 'border-foreground opacity-60'
                }`
              }
              onClick={() => handleClick(participant, index)}
            >
              {participant.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
