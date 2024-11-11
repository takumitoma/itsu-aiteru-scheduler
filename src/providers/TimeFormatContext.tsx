'use client';

import { createContext, useContext, useState } from 'react';

interface TimeFormatContextProviderProps {
  children: React.ReactNode;
}

type TimeFormat = 12 | 24;

interface TimeFormatContext {
  timeFormat: TimeFormat;
  setTimeFormat: React.Dispatch<React.SetStateAction<TimeFormat>>;
}

const TimeFormatContext = createContext<TimeFormatContext | null>(null);

const TimeFormatContextProvider = ({ children }: TimeFormatContextProviderProps) => {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(24);

  return (
    <TimeFormatContext.Provider
      value={{
        timeFormat,
        setTimeFormat,
      }}
    >
      {children}
    </TimeFormatContext.Provider>
  );
};

export default TimeFormatContextProvider;

export function useTimeFormatContext() {
  const context = useContext(TimeFormatContext);
  if (!context) {
    throw new Error('useTimeFormatContext must be used within a TimeFormatContextProvider');
  }
  return context;
}
