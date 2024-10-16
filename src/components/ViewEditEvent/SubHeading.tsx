interface SubHeadingProps {
  isEditing: boolean;
  selectedParticipant: string;
  getColorRangeText: (index: number) => string;
  selectedColorScaleIndex: number | null;
  editingParticipant: string;
}

const SubHeading: React.FC<SubHeadingProps> = ({
  isEditing,
  selectedParticipant,
  getColorRangeText,
  selectedColorScaleIndex,
  editingParticipant,
}) => {
  function getHeadingText(): string {
    if (isEditing) {
      return `空き時間を編集中: ${editingParticipant}`;
    }
    if (selectedParticipant) {
      return `空き時間を表示中: ${selectedParticipant}`;
    }
    if (selectedColorScaleIndex !== null) {
      return `空き時間を表示中: ${getColorRangeText(selectedColorScaleIndex)}人参加可能`;
    }

    return '全員の空き時間';
  }

  return <h2 className="text-sm sm:text-xl font-bold truncate">{getHeadingText()}</h2>;
};

export default SubHeading;
