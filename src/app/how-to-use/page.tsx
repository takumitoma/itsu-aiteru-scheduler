'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import { useTheme } from 'next-themes';

const getInstructions = (theme: string | undefined): Instruction[] => [
  {
    number: 1,
    title: '会いたい日時を教えてください。',
    description: 'まず、グループと会いたい日程と時間を選択し、イベントを作成してください。',
    imagePath: `/how-to-use/${theme || 'light'}-step-1.JPG`,
    imageAlt: 'how to use app step 1',
  },
  {
    number: 2,
    title: '自分の空き時間を入力してください。',
    description:
      '選択した日時に対する自分の空いている時間を入力すると、他の参加者にも表示されます。',
    imagePath: `/how-to-use/${theme || 'light'}-step-2.JPG`,
    imageAlt: 'how to use app step 2',
  },
  {
    number: 3,
    title: 'みんなにとって最適な時間を見つてください。',
    description:
      'イベントのリンクをグループと共有すると、他参加者も自分の空いている時間を入力できます。全員の空いている時間を重ねて表示し、最適な時間を簡単に見つけられるようにします。',
    imagePath: `/how-to-use/${theme || 'light'}-step-3.JPG`,
    imageAlt: 'how to use app step 3',
  },
];

interface Instruction {
  number: number;
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
}

const Instruction: React.FC<Instruction> = ({
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
  const instructions = getInstructions(theme);

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">使い方</h1>
      <ol className="space-y-8 w-full">
        {instructions.map((step) => (
          <Instruction key={step.number} {...step} />
        ))}
      </ol>
      <div className="flex flex-col py-8 space-y-6 sm:space-y-8 justify-center items-center">
        <p className="text-xl sm:text-2xl font-bold text-center">
          アカウント登録不要、ログイン不要、今すぐ使えます!
        </p>
        <Link href="/" className="three-d mt-2 sm:mt-4 w-fit flex items-center gap-4">
          イベント作成ページへ
          <FaRegArrowAltCircleRight size={24} />
        </Link>
      </div>
    </div>
  );
};

export default HowToUsePage;
