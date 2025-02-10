import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { supabase } from '@/lib/supabase/browser-client';

interface LogoutButtonProps {
  className: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const t = useTranslations('Header');
  const router = useRouter();

  async function handleClick() {
    await supabase.auth.signOut();
    router.push('/?logout=true');
    router.refresh();
  }

  return (
    <button onClick={handleClick} className={className}>
      {t('logout')}
    </button>
  );
}
