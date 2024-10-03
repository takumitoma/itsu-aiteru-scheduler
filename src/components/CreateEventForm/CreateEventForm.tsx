'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import EventTitleInput from './EventTitleInput';
import SurveyTypeSelector from './SurveyTypeSelector';
import TimezoneSelector from './TimezoneSelector';
import TimeRangeSelector from './TimeRangeSelector';
import Calendar from './Calendar';
import WeekCalendar from './WeekCalendar';
import PasswordInput from './PasswordInput';
import CreateEventButton from './CreateEventButton';

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [surveyType, setSurveyType] = useState<'specific' | 'week'>('specific');
  const [timeRange, setTimeRange] = useState({ start: 9, end: 18 });
  const [selectedDates, setSelectedDates] = useState<dayjs.Dayjs[]>([]);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Tokyo');
  const [password, setPassword] = useState('');

  function handleCreateEvent() {
    console.log('Event created:', {
      title: eventTitle,
      timezone: selectedTimezone,
      timeRange,
      dates: selectedDates,
      daysOfWeek: selectedDaysOfWeek,
      password,
    });
  }

  console.log('Event created:', {
    title: eventTitle,
    timezone: selectedTimezone,
    timeRange,
    dates: selectedDates,
    daysOfWeek: selectedDaysOfWeek,
    password,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16 max-w-[60rem]">
      <div className="md:order-1">
        <EventTitleInput value={eventTitle} onChange={setEventTitle} />
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
          <Calendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
        ) : (
          <WeekCalendar selectedDays={selectedDaysOfWeek} setSelectedDays={setSelectedDaysOfWeek} />
        )}
      </div>

      <div className="md:order-7">
        <PasswordInput value={password} onChange={setPassword} />
      </div>
      <div className="md:order-9 md:col-span-2">
        <CreateEventButton onClick={handleCreateEvent} />
      </div>

      <div className="hidden md:block md:order-2"></div>
      <div className="hidden md:block md:order-8"></div>
    </div>
  );
};

export default CreateEventForm;
