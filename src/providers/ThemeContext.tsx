import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  return (
    <NextThemesProvider
      themes={['light', 'dark']}
      attribute="class"
      defaultTheme="light"
      enableSystem
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}
