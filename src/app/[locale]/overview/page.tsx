import { useTranslations } from 'next-intl';
import { FaCheck } from 'react-icons/fa6';
import { CalendarSvg, ShareSvg, CursorHandSvg, CustomSvgProps } from '@/components/svg';
import { IconType } from 'react-icons';
import { MdMeetingRoom } from 'react-icons/md';
import { LuBookOpen, LuUsers, LuVideo } from 'react-icons/lu';

interface FeatureCard {
  titleKey: 'dateTime' | 'access' | 'interface';
  Icon: React.FC<CustomSvgProps>;
  featureCount: number; // how many features to map, prevents error with .map()
}

interface UseCaseCard {
  titleKey: 'team' | 'study' | 'friends' | 'online';
  Icon: IconType;
}

interface RestrictionCard {
  titleKey: 'duration' | 'eventName' | 'participantName' | 'timeUnit';
}

const featureCards: FeatureCard[] = [
  {
    titleKey: 'dateTime',
    Icon: CalendarSvg,
    featureCount: 2,
  },
  {
    titleKey: 'access',
    Icon: ShareSvg,
    featureCount: 3,
  },
  {
    titleKey: 'interface',
    Icon: CursorHandSvg,
    featureCount: 4,
  },
] as const;

const useCaseCards: UseCaseCard[] = [
  {
    titleKey: 'team',
    Icon: MdMeetingRoom,
  },
  {
    titleKey: 'study',
    Icon: LuBookOpen,
  },
  {
    titleKey: 'friends',
    Icon: LuUsers,
  },
  {
    titleKey: 'online',
    Icon: LuVideo,
  },
] as const;

const restrictionCards: RestrictionCard[] = [
  { titleKey: 'duration' },
  { titleKey: 'eventName' },
  { titleKey: 'participantName' },
  { titleKey: 'timeUnit' },
] as const;

interface FeatureCardProps {
  card: FeatureCard;
  t: ReturnType<typeof useTranslations>;
}

function FeatureCard({ card, t }: FeatureCardProps) {
  const featureIndices = Array.from({ length: card.featureCount }, (_, i) => i);

  return (
    <div className="w-full space-y-6 flex flex-col items-center border border-grayCustom p-4 rounded-md">
      <h3 className="text-lg font-medium">{t(`sections.features.cards.${card.titleKey}.title`)}</h3>
      <card.Icon color="var(--primary)" />
      <ul className="space-y-4 w-full list-none">
        {featureIndices.map((index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <FaCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm">
              {t(`sections.features.cards.${card.titleKey}.list.${index}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface UseCaseCardProps {
  card: UseCaseCard;
  t: ReturnType<typeof useTranslations>;
}

function UseCaseCard({ card, t }: UseCaseCardProps) {
  return (
    <div className="w-full space-y-6 flex flex-col items-center border border-grayCustom p-4 rounded-md">
      <h3 className="text-lg font-medium">{t(`sections.useCases.cards.${card.titleKey}`)}</h3>
      <card.Icon size={96} className="text-primary" />
    </div>
  );
}

interface RestrictionCardProps {
  card: RestrictionCard;
  t: ReturnType<typeof useTranslations>;
}

function RestrictionCard({ card, t }: RestrictionCardProps) {
  return (
    <div className="w-full space-y-6 flex flex-col items-center border border-grayCustom p-6 rounded-md">
      <h3 className="text-lg font-medium">
        {t(`sections.restrictions.cards.${card.titleKey}.title`)}
      </h3>
      <p className="text-2xl font-bold text-primary text-center">
        {t(`sections.restrictions.cards.${card.titleKey}.limit`)}
      </p>
    </div>
  );
}

function OverviewPage() {
  const t = useTranslations('Overview');

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('pageTitle')}
      </h1>

      <section className="w-full space-y-4">
        <h2 className="text-primary">{t('sections.purpose.title')}</h2>
        <p className="leading-relaxed">{t('sections.purpose.description')}</p>
      </section>

      <section className="w-full space-y-4">
        <h2 className="text-primary">{t('sections.features.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featureCards.map((card, index) => (
            <FeatureCard key={index} card={card} t={t} />
          ))}
        </div>
      </section>

      <section className="w-full space-y-4">
        <h2 className="text-primary">{t('sections.useCases.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCaseCards.map((card, index) => (
            <UseCaseCard key={index} card={card} t={t} />
          ))}
        </div>
        <p className="-mt-1">{t('sections.useCases.suffix')}</p>
      </section>

      <section className="w-full space-y-4">
        <h2 className="text-primary">{t('sections.restrictions.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {restrictionCards.map((card, index) => (
            <RestrictionCard key={index} card={card} t={t} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default OverviewPage;
