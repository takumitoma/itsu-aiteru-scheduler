'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface TimeFormatContextProviderProps {
  children: React.ReactNode;
}

type TimeFormat = 12 | 24;

interface TimeFormatContext {
  timeFormat: TimeFormat;
  setTimeFormat: (timeFormat: TimeFormat) => void;
}

const TimeFormatContext = createContext<TimeFormatContext | null>(null);

export default function TimeFormatContextProvider({ children }: TimeFormatContextProviderProps) {
  const [timeFormat, updateTimeFormatState] = useState<TimeFormat>(24);

  useEffect(() => {
    // Listen for changes from other tabs/windows
    function handleStorageChange(event: StorageEvent) {
      if (event.key === 'timeFormat' && event.newValue) {
        updateTimeFormatState(parseInt(event.newValue) as TimeFormat);
      }
    }

    if (typeof window !== 'undefined') {
      // Initial load from localStorage
      const savedFormat = localStorage.getItem('timeFormat');
      if (savedFormat) {
        updateTimeFormatState(parseInt(savedFormat) as TimeFormat);
      }

      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  function setTimeFormat(newFormat: TimeFormat) {
    updateTimeFormatState(newFormat);
    localStorage.setItem('timeFormat', JSON.stringify(newFormat));
  }

  return (
    <TimeFormatContext.Provider
      value={{
        timeFormat,
        setTimeFormat: setTimeFormat,
      }}
    >
      {children}
    </TimeFormatContext.Provider>
  );
}

export function useTimeFormatContext() {
  const context = useContext(TimeFormatContext);
  if (!context) {
    throw new Error('useTimeFormatContext must be used within a TimeFormatContextProvider');
  }
  return context;
}
