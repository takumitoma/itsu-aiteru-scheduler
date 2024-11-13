'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

interface Instruction {
  number: number;
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
}

const InstructionStep: React.FC<Instruction> = ({
  number,
  title,
  description,
  imagePath,
  imageAlt,
}) => (
  <li
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
      space-y-4 sm:space-y-0"
  >
    <div className="flex flex-col sm:py-4 sm:space-y-4 sm:w-[45%]">
      <h2 className="text-primary">{`${number}) ${title}`}</h2>
      <p>{description}</p>
    </div>
    <div className="w-full sm:w-[45%] relative h-32 sm:h-48">
      <Image
        src={imagePath}
        alt={imageAlt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 45vw"
        priority={number === 1}
      />
    </div>
  </li>
);

const HowToUsePage: React.FC = () => {
  const { theme } = useTheme();
  const t = useTranslations('HowToUse');

  const instructions: Instruction[] = [1, 2, 3].map((step) => ({
    number: step,
    title: t(`steps.${step}.title`),
    description: t(`steps.${step}.description`),
    imagePath: `/how-to-use/${theme || 'light'}-step-${step}.JPG`,
    imageAlt: `how to use app step ${step}`,
  }));

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('pageTitle')}
      </h1>
      <ol className="space-y-8 w-full">
        {instructions.map((step) => (
          <InstructionStep key={step.number} {...step} />
        ))}
      </ol>
      <div className="flex flex-col py-8 space-y-6 sm:space-y-8 justify-center items-center">
        <p className="text-xl sm:text-2xl font-bold text-center">{t('callToAction.message')}</p>
        <Link href="/" className="three-d mt-2 sm:mt-4 w-fit flex items-center gap-4">
          {t('callToAction.button')}
          <FaRegArrowAltCircleRight size={24} />
        </Link>
      </div>
    </div>
  );
};

export default HowToUsePage;
