import { FaCheck } from 'react-icons/fa6';
import { CalendarSvg, ShareSvg, CursorHandSvg, CustomSvgProps } from '@/components/svg';

interface FeatureCardProps {
  title: string;
  Icon: React.FC<CustomSvgProps>;
  features: string[];
}

const featureCards: FeatureCardProps[] = [
  {
    title: '柔軟な日時設定',
    Icon: CalendarSvg,
    features: ['特定の日付または曜日での調整', '15分単位の時間設定'],
  },
  {
    title: 'シンプルなアクセス',
    Icon: ShareSvg,
    features: ['URLの共有だけで参加者を招待', 'アカウント登録・ログイン不要', 'すぐに利用開始可能'],
  },
  {
    title: '直感的な操作画面',
    Icon: CursorHandSvg,
    features: [
      'スマートフォン・タブレット対応',
      '参加可能人数をヒートマップで表示',
      '各時間枠の参加者を即座に確認',
      '特定の参加者や参加人数でフィルター可能',
    ],
  },
];

const FeatureCard: React.FC<{ card: FeatureCardProps }> = ({ card }) => (
  <div
    className="w-full space-y-6 flex flex-col items-center border border-gray-500 
      p-4 rounded-md"
  >
    <h3 className="text-lg font-medium">{card.title}</h3>
    <card.Icon color="var(--primary)" />
    <ul className="space-y-4 w-full list-none">
      {card.features.map((feature, index) => (
        <li key={index} className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <FaCheck className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm sm:text-base">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const OverviewPage: React.FC = () => {
  return (
    <div
      className="container mx-auto py-4 sm:py-8 flex flex-col items-center px-4 sm:px-0 space-y-4 
        sm:space-y-8"
    >
      <h1 className="text-3xl font-bold">サービス概要</h1>

      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-primary">サービスの目的</h2>
        <p className="text-base sm:text-lg leading-relaxed">
          グループでの予定調整をシンプルに。「いつ空いてる？」は、メンバー全員の予定をビジュアルで確認でき、最適な時間を簡単に見つけることができる無料のスケジュール調整ツールです。
        </p>
      </section>

      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-primary">機能紹介</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featureCards.map((card, index) => (
            <FeatureCard key={index} card={card} />
          ))}
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-primary">想定利用シーン</h2>
        <ul className="list-disc list-inside space-y-1 text-base sm:text-lg">
          <li>チームミーティング</li>
          <li>勉強会・サークル活動</li>
          <li>友人との予定</li>
          <li>オンラインイベント</li>
        </ul>
        <p className="-mt-1 text-base sm:text-lg ml-6">など</p>
      </section>

      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-primary">制限事項</h2>
        <ul className="list-disc list-inside space-y-1 text-base sm:text-lg">
          <li>イベントの日数:31日まで</li>
          <li>イベント名:100文字まで</li>
          <li>参加者名:2〜20文字</li>
          <li>時間設定:15分単位</li>
        </ul>
      </section>
    </div>
  );
};

export default OverviewPage;
