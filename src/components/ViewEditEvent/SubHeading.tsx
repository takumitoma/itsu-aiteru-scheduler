import { Participant } from '@/types/Participant';
import { useTranslations } from 'next-intl';

interface SubHeadingProps {
  mode: 'view' | 'edit' | 'delete';
  selectedParticipant: Participant | null;
  getColorRangeText: (index: number) => string;
  selectedColorScaleIndex: number | null;
  editingParticipant: Participant | null;
}

export function SubHeading({
  mode,
  selectedParticipant,
  getColorRangeText,
  selectedColorScaleIndex,
  editingParticipant,
}: SubHeadingProps) {
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
          <span className="flex-shrink-0 font-normal">{t('individualAvailability.name')}</span>
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
    <section className="flex w-full flex-col space-y-2">
      <h2 className="truncate">{getHeadingText()}</h2>
      {mode === 'view' && <p className="text-xs text-gray-600 sm:text-sm">{t('hoverHelp')}</p>}
    </section>
  );
}
