import Image from 'next/image';
import Link from 'next/link';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';

const HowToUsePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-8">
      <h1>使い方</h1>
      <ol className="space-y-8 w-full">
        <li
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
            space-y-4 sm:space-y-0"
        >
          <div className="flex flex-col sm:py-4 sm:space-y-4 sm:w-[45%]">
            <h2 className="text-primary">{'1) 会いたい日時を教えてください。'}</h2>
            <p className="text-base sm:text-lg">
              まず、グループと会いたい日程と時間を選択し、イベントを作成してください。
            </p>
          </div>
          <div className="w-full sm:w-[45%] relative h-32 sm:h-48">
            <Image
              src="/how-to-use/how-to-use-1.jpg"
              alt="how to use app step 1"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          </div>
        </li>
        <li
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
          space-y-4 sm:space-y-0"
        >
          <div className="flex flex-col sm:py-4 sm:space-y-4 sm:w-[45%]">
            <h2 className="text-primary">{'2)自分の空き時間を入力してください。'}</h2>
            <p className="text-base sm:text-lg">
              選択した日時に対する自分の空いている時間を入力すると、他の参加者にも表示されます。
            </p>
          </div>
          <div className="w-full sm:w-[45%] relative h-32 sm:h-48">
            <Image
              src="/how-to-use/how-to-use-2.jpg"
              alt="how to use app step 2"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </li>
        <li
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
          space-y-4 sm:space-y-0"
        >
          <div className="flex flex-col sm:py-4 sm:space-y-4 sm:w-[45%]">
            <h2 className="text-primary">{'3)みんなにとって最適な時間を見つてください。'}</h2>
            <p className="text-base sm:text-lg">
              イベントのリンクをグループと共有すると、他参加者も自分の空いている時間を入力できます。全員の空いている時間を重ねて表示し、最適な時間を簡単に見つけられるようにします。
            </p>
          </div>
          <div className="w-full sm:w-[45%] relative h-32 sm:h-48">
            <Image
              src="/how-to-use/how-to-use-3.jpg"
              alt="how to use app step 3"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </li>
      </ol>
      <div className="flex flex-col py-8 space-y-6 sm:space-y-8 justify-center items-center">
        <p className="text-xl sm:text-2xl font-bold text-center">
          アカウント登録不要、ログイン不要、今すぐ使えます!
        </p>
        <Link
          href="/"
          className="bg-primary text-white text-lg sm:text-xl text-center p-4 mt-2 sm:mt-4 
            rounded-md outline-customBlack outline-4 three-d w-fit flex items-center gap-4"
        >
          イベント作成ページへ
          <FaRegArrowAltCircleRight size={24} />
        </Link>
      </div>
    </div>
  );
};

export default HowToUsePage;
