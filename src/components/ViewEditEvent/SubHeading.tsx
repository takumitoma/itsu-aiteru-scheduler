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
  function getHeadingText(): string | JSX.Element {
    if (isEditing) {
      return `空き時間を編集中: ${editingParticipant}`;
    }
    if (selectedParticipant) {
      return (
        <div className="flex items-center whitespace-nowrap">
          <span className="truncate">{selectedParticipant}</span>
          <span className="font-normal flex-shrink-0">の空き時間</span>
        </div>
      );
    }
    if (selectedColorScaleIndex !== null) {
      return (
        <>
          {`${getColorRangeText(selectedColorScaleIndex)}人`}
          <span className="font-normal">の空き時間</span>
        </>
      );
    }

    return 'スケジュール調整表';
  }

  return (
    <section className="flex flex-col space-y-2 w-full">
      <h2 className="text-sm sm:text-xl font-bold truncate">{getHeadingText()}</h2>
      {!isEditing && (
        <p className="text-xs sm:text-sm text-gray-600">
          スケジュール表をマウスオーバーもしくはタップで詳細を確認
        </p>
      )}
    </section>
  );
};

export default SubHeading;
