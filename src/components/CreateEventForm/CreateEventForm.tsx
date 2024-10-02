'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import EventTitleInput from './EventTitleInput';
import SurveyTypeSelector from './SurveyTypeSelector';
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
  const [password, setPassword] = useState('');

  function handleCreateEvent() {
    console.log('Event created:', {
      title: eventTitle,
      timeRange,
      dates: selectedDates,
      daysOfWeek: selectedDaysOfWeek,
      password,
    });
  }

  console.log('Event created:', {
    title: eventTitle,
    timeRange,
    dates: selectedDates,
    daysOfWeek: selectedDaysOfWeek,
    password,
  });

  return (
    <div>
      <EventTitleInput value={eventTitle} onChange={setEventTitle} />
      <SurveyTypeSelector value={surveyType} onChange={setSurveyType} />
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      <Calendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
      <WeekCalendar selectedDays={selectedDaysOfWeek} setSelectedDays={setSelectedDaysOfWeek} />
      <PasswordInput value={password} onChange={setPassword} />
      <CreateEventButton onClick={handleCreateEvent} />
    </div>
  );
};

export default CreateEventForm;
