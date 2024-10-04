'use client';

import { useState } from 'react';
import EventTitleInput from './EventTitleInput';
import SurveyTypeSelector from './SurveyTypeSelector';
import TimezoneSelector from './TimezoneSelector';
import TimeRangeSelector from './TimeRangeSelector';
import Calendar from './Calendar';
import WeekCalendar from './WeekCalendar';
import CreateEventButton from './CreateEventButton';

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [surveyType, setSurveyType] = useState<'specific' | 'week'>('specific');
  const [timeRange, setTimeRange] = useState({ start: 9, end: 18 });
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Tokyo');
  const [showErrors, setShowErrors] = useState(false);

  function formIsValid() {
    if (eventTitle.trim().length === 0) {
      return false;
    }
    if (surveyType === 'specific' && selectedDates.length === 0) {
      return false;
    }
    if (surveyType === 'week' && selectedDaysOfWeek.length === 0) {
      return false;
    }
    return true;
  }

  function handleCreateEvent() {
    if (formIsValid()) {
      console.log('Event created:', {
        title: eventTitle,
        timezone: selectedTimezone,
        timeRange,
        dates: selectedDates,
        daysOfWeek: selectedDaysOfWeek,
      });
    } else {
      console.log('Error: Form validation failed');
      setShowErrors(true);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16 max-w-[60rem]">
      <div className="md:order-1">
        <EventTitleInput value={eventTitle} onChange={setEventTitle} showError={showErrors} />
      </div>

      <div className="md:order-4">
        <TimezoneSelector value={selectedTimezone} onChange={setSelectedTimezone} />
      </div>
      <div className="md:order-6">
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="md:order-3">
        <SurveyTypeSelector value={surveyType} onChange={setSurveyType} />
      </div>
      <div className="md:order-5">
        {surveyType === 'specific' ? (
          <Calendar
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            timezone={selectedTimezone}
            showError={showErrors}
          />
        ) : (
          <WeekCalendar
            selectedDays={selectedDaysOfWeek}
            setSelectedDays={setSelectedDaysOfWeek}
            showError={showErrors}
          />
        )}
      </div>

      <div className="md:order-7 md:col-span-2">
        <CreateEventButton onClick={handleCreateEvent} />
      </div>

      <div className="hidden md:block md:order-2"></div>
    </div>
  );
};

export default CreateEventForm;
