import { ThemeContextProvider } from './ThemeContext';
import { TimeFormatContextProvider } from './TimeFormatContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeContextProvider>
      <TimeFormatContextProvider>{children}</TimeFormatContextProvider>
    </ThemeContextProvider>
  );
}
