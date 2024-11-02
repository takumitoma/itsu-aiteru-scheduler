const OverviewPage: React.FC = () => {
  return (
    <div
      className="container mx-auto py-4 sm:py-8 flex flex-col items-center px-4 sm:px-0 space-y-4 
        sm:space-y-8"
    >
      <h1 className="text-3xl font-bold">サービス概要</h1>

      <section className="w-full max-w-5xl space-y-2">
        <h2 className="text-primary">サービスの目的</h2>
        <p className="text-base sm:text-lg leading-relaxed">
          グループでの予定調整をシンプルに。「いつ空いてる？」は、メンバー全員の予定をビジュアルで確認でき、最適な時間を簡単に見つけることができる無料のスケジュール調整ツールです。
        </p>
      </section>

      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-primary">機能紹介</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3>柔軟な日時設定</h3>
            <ul className="list-disc list-inside space-y-1 text-base sm:text-lg">
              <li>特定の日付または曜日ベースでの調整</li>
              <li>15分単位の時間設定</li>
              <li>世界中のタイムゾーンに対応</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3>シンプルな共有とアクセス</h3>
            <ul className="list-disc list-inside space-y-1 text-base sm:text-lg">
              <li>URLのシェアだけで参加者を招待</li>
              <li>アカウント登録・ログイン不要</li>
              <li>すぐに利用開始可能</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3>直感的な操作と見やすい表示</h3>
            <ul className="list-disc list-inside space-y-1 text-base sm:text-lg">
              <li>ドラッグ＆ドロップで空き時間を入力</li>
              <li>スマートフォン・タブレット対応</li>
              <li>参加可能人数をヒートマップで表示</li>
              <li>各時間枠の参加者を即座に確認</li>
              <li>特定の参加者や参加人数でフィルター可能</li>
            </ul>
          </div>
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
