interface ParticipantsListProps {
  participantNames: string[];
  selectedParticipant: string;
  setSelectedParticipant: (participant: string | ((prev: string) => string)) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participantNames,
  selectedParticipant,
  setSelectedParticipant,
}) => {
  function handleClick(participant: string) {
    setSelectedParticipant((prevParticipant) => {
      if (prevParticipant === participant) {
        return '';
      }
      return participant;
    });
  }

  return (
    <section className="w-full space-y-2">
      <p className="text-xs sm:text-lg font-bold text-center">
        各参加者の名前をクリックで、それぞれの空き時間を確認
      </p>
      <ul className="flex flex-wrap gap-2 text-xs sm:text-lg">
        {participantNames.map((participant, index) => (
          <li key={`participant-${index}`}>
            <button
              className={`hover:opacity-100 hover:border-primary border px-2 py-1 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedParticipant === participant
                    ? 'border-primary font-bold opacity-100'
                    : 'border-foreground opacity-60'
                }`}
              onClick={() => handleClick(participant)}
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
