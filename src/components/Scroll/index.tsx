'use client';

import { usePathname } from '@/i18n/routing';
import { useEffect } from 'react';

export function Scroll() {
  // when clicking a link, user will not scroll to the top of the page if the header is sticky.
  // their current scroll position will persist to the next page.
  // this useEffect is a workaround to 'fix' that behavior.
  // https://github.com/vercel/next.js/issues/45187#issuecomment-1639518030

  const pathname = usePathname();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return <></>;
}
