import { useRef } from 'react';

interface ParticipantsListProps {
  participantNames: string[];
  selectedParticipant: string;
  setSelectedParticipant: React.Dispatch<React.SetStateAction<string>>;
  setSelectedColorScaleIndex: (index: number | null) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participantNames,
  selectedParticipant,
  setSelectedParticipant,
  setSelectedColorScaleIndex,
}) => {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleClick(participant: string, index: number) {
    setSelectedColorScaleIndex(null);
    setSelectedParticipant((prevParticipant) => {
      if (prevParticipant === participant) {
        return '';
      }
      return participant;
    });
    buttonRefs.current[index]?.blur();
  }

  return (
    <section className="w-full space-y-2">
      <h2 className="text-md sm:text-xl font-medium">{`参加者数: ${participantNames.length}人`}</h2>
      <p className="text-xs sm:text-sm text-gray-600">名前をクリックで、それぞれの空き時間を表示</p>
      <ul className="flex flex-wrap gap-2 text-xs sm:text-lg">
        {participantNames.map((participant, index) => (
          <li key={`participant-${index}`}>
            <button
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              className={`hover:opacity-100 hover:border-primary border px-2 py-1 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedParticipant === participant
                    ? 'border-2 border-primary font-bold opacity-100'
                    : 'border-foreground opacity-60'
                }`}
              onClick={() => handleClick(participant, index)}
            >
              {participant}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ParticipantsList;
