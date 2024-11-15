import ThemeContextProvider from './ThemeContext';
import TimeFormatContextProvider from './TimeFormatContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeContextProvider>
      <TimeFormatContextProvider>{children}</TimeFormatContextProvider>
    </ThemeContextProvider>
  );
}
