import { Participant } from '@/types/Participant';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('ViewEditEvent.SubHeading');

  function getHeadingText(): string | JSX.Element {
    if (mode === 'edit') {
      return t('editingMode') + editingParticipant?.name;
    }
    if (mode === 'delete') {
      return t('deleteMode') + (selectedParticipant ? selectedParticipant.name : '');
    }
    if (selectedParticipant) {
      return (
        <div className="flex items-center whitespace-nowrap">
          <span className="truncate">{selectedParticipant.name}</span>
          <span className="font-normal flex-shrink-0">{t('individualAvailability.name')}</span>
        </div>
      );
    }
    if (selectedColorScaleIndex !== null) {
      return (
        <>
          {getColorRangeText(selectedColorScaleIndex) + t('groupAvailability.count')}
          <span className="font-normal">{t('groupAvailability.suffix')}</span>
        </>
      );
    }

    return t('defaultTitle');
  }

  return (
    <section className="flex flex-col space-y-2 w-full">
      <h2 className="truncate">{getHeadingText()}</h2>
      {mode === 'view' && <p className="text-xs sm:text-sm text-gray-600">{t('hoverHelp')}</p>}
    </section>
  );
};

export default SubHeading;
