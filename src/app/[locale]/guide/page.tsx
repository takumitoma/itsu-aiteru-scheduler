'use client';

import Image from 'next/image';
import { TransitionLink } from '@/components/TransitionLink';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';

interface Instruction {
  number: number;
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
}

function InstructionStep({ number, title, description, imagePath, imageAlt }: Instruction) {
  return (
    <li className="pace-y-4 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-col sm:w-[45%] sm:space-y-4 sm:py-4">
        <h2 className="text-primary">{`${number}) ${title}`}</h2>
        <p>{description}</p>
      </div>
      <div className="relative h-32 w-full sm:h-48 sm:w-[45%]">
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
}

export default function GuidePage() {
  const { theme } = useTheme();
  const t = useTranslations('Guide');
  const locale = useLocale();

  const instructions: Instruction[] = [1, 2, 3].map((step) => ({
    number: step,
    title: t(`steps.${step}.title`),
    description: t(`steps.${step}.description`),
    imagePath: `/guide/${locale}-${theme || 'light'}-step-${step}.JPG`,
    imageAlt: `quick guide step ${step}`,
  }));

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        {t('pageTitle')}
      </h1>
      <ol className="w-full space-y-8">
        {instructions.map((step) => (
          <InstructionStep key={step.number} {...step} />
        ))}
      </ol>
      <div className="flex flex-col items-center justify-center space-y-6 py-8 sm:space-y-8">
        <p className="text-center text-xl font-bold sm:text-2xl">{t('callToAction.message')}</p>
        <div>
          <TransitionLink href="/" className="three-d mt-2 flex w-fit items-center gap-4 sm:mt-4">
            {t('callToAction.createEventButton')}
            <FaRegArrowAltCircleRight size={24} />
          </TransitionLink>
          <TransitionLink
            href={`/e/${t('callToAction.demoEventLink')}`}
            className="three-d mt-2 flex w-full items-center justify-between gap-4 sm:mt-4"
          >
            {t('callToAction.demoEventButton')}
            <FaRegArrowAltCircleRight size={24} />
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
