import ThemeContextProvider from './ThemeContext';
import TimeFormatContextProvider from './TimeFormatContext';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeContextProvider>
      <TimeFormatContextProvider>{children}</TimeFormatContextProvider>
    </ThemeContextProvider>
  );
};

export default Providers;
