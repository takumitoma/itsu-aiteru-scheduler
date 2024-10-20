import { useRef } from 'react';
import { Participant } from '@/types/Participant';

interface ParticipantsListProps {
  mode: 'view' | 'edit' | 'delete';
  participants: Participant[];
  selectedParticipant: Participant | null;
  setSelectedParticipant: React.Dispatch<React.SetStateAction<Participant | null>>;
  setSelectedColorScaleIndex: (index: number | null) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  mode,
  participants,
  selectedParticipant,
  setSelectedParticipant,
  setSelectedColorScaleIndex,
}) => {
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
      <h2 className="text-md sm:text-xl font-medium">{`参加者数: ${participants.length}人`}</h2>
      <p className="text-xs sm:text-sm text-gray-600">
        {mode === 'view'
          ? '名前をクリックで、それぞれの空き時間を表示'
          : '名前をクリックで、削除したい参加者を選択'}
      </p>
      <ul className="flex flex-wrap gap-2 text-xs sm:text-lg">
        {participants.map((participant, index) => (
          <li key={`participant-${participant.id}`}>
            <button
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              className={`hover:opacity-100 hover:border-primary border px-2 py-1 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedParticipant?.id === participant.id
                    ? 'border-2 border-primary font-bold opacity-100'
                    : 'border-foreground opacity-60'
                }`}
              onClick={() => handleClick(participant, index)}
            >
              {participant.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ParticipantsList;
