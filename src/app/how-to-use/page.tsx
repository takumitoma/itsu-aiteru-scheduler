import Image from 'next/image';
import Link from 'next/link';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';

const HowToUsePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0 space-y-8">
      <h1 className="text-3xl font-bold">使い方</h1>
      <ol className="space-y-8">
        <li className="flex items-center justify-between">
          <div className="flex flex-col py-4 space-y-4 w-[45%]">
            <strong className="text-2xl font-medium text-primary">
              {'1) 会いたい日時を教えてください。'}
            </strong>
            <p className="text-xl">
              まず、グループと会いたい日程と時間を選択し、イベントを作成してください。
            </p>
          </div>
          <div className="w-[45%] relative h-64">
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
        <li className="flex items-center justify-between">
          <div className="flex flex-col py-4 space-y-4 w-[45%]">
            <strong className="text-2xl font-medium text-primary">
              {'2)自分の空き時間を入力してください。'}
            </strong>
            <p className="text-xl">
              選択した日時に対する自分の空いている時間を入力すると、他の参加者にも表示されます。
            </p>
          </div>
          <div className="w-[45%] relative h-64">
            <Image
              src="/how-to-use/how-to-use-2.jpg"
              alt="how to use app step 2"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </li>
        <li className="flex items-center justify-between">
          <div className="flex flex-col py-4 space-y-4 w-[45%]">
            <strong className="text-2xl font-medium text-primary">
              {'3)みんなにとって最適な時間を見つてください。'}
            </strong>
            <p className="text-xl">
              イベントのリンクをグループと共有すると、他参加者も自分の空いている時間を入力できます。全員の空いている時間を重ねて表示し、最適な時間を簡単に見つけられるようにします。
            </p>
          </div>
          <div className="w-[45%] relative h-64">
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
      <div className="flex flex-col space-y-8 justify-center items-center">
        <p className="text-2xl font-bold">アカウント登録不要、ログイン不要、今すぐ使えます!</p>
        <Link
          href="/"
          className="bg-primary text-white text-xl text-center px-4 py-4 mt-4 rounded-md 
            outline-customBlack outline-4 three-d w-fit flex items-center gap-4"
        >
          イベント作成ページへ
          <FaRegArrowAltCircleRight size={24} />
        </Link>
      </div>
    </div>
  );
};

export default HowToUsePage;
