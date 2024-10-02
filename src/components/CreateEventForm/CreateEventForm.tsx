'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import EventTitleInput from './EventTitleInput';
import SurveyTypeSelector from './SurveyTypeSelector';
import TimeRangeSelector from './TimeRangeSelector';
import Calendar from './Calendar';
import PasswordInput from './PasswordInput';
import CreateEventButton from './CreateEventButton';

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [surveyType, setSurveyType] = useState<'specific' | 'week'>('specific');
  const [timeRange, setTimeRange] = useState({ start: 9, end: 18 });
  const [selectedDates, setSelectedDates] = useState<dayjs.Dayjs[]>([]);
  const [password, setPassword] = useState('');

  const handleCreateEvent = () => {
    console.log('Event created:', {
      title: eventTitle,
      password,
    });
  };

  console.log('Event created:', {
    title: eventTitle,
    timeRange,
    dates: selectedDates,
    password,
  });

  return (
    <div>
      <EventTitleInput value={eventTitle} onChange={setEventTitle} />
      <SurveyTypeSelector value={surveyType} onChange={setSurveyType} />
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      <Calendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
      <PasswordInput value={password} onChange={setPassword} />
      <CreateEventButton onClick={handleCreateEvent} />
    </div>
  );
};

export default CreateEventForm;
