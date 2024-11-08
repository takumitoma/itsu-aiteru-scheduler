import { Participant } from '@/types/Participant';

interface SubHeadingProps {
  mode: 'view' | 'edit' | 'delete';
  selectedParticipant: Participant | null;
  getColorRangeText: (index: number) => string;
  selectedColorScaleIndex: number | null;
  editingParticipant: Participant | null;
}

const SubHeading: React.FC<SubHeadingProps> = ({
  mode,
  selectedParticipant,
  getColorRangeText,
  selectedColorScaleIndex,
  editingParticipant,
}) => {
  function getHeadingText(): string | JSX.Element {
    if (mode === 'edit') {
      return `空き時間を編集中: ${editingParticipant?.name}`;
    }
    if (mode === 'delete') {
      return `参加者を削除: ${selectedParticipant ? selectedParticipant.name : ''}`;
    }
    if (selectedParticipant) {
      return (
        <div className="flex items-center whitespace-nowrap">
          <span className="truncate">{selectedParticipant.name}</span>
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
      <h2 className="truncate">{getHeadingText()}</h2>
      {mode === 'view' && (
        <p className="text-xs sm:text-sm text-gray-600">
          スケジュール表をマウスオーバーもしくはタップで詳細を確認
        </p>
      )}
    </section>
  );
};

export default SubHeading;
