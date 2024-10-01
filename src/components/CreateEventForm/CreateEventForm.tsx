'use client';

import { useState } from 'react';
import EventTitleInput from './EventTitleInput';
import TimeRangeSelector from './TimeRangeSelector';
import PasswordInput from './PasswordInput';
import CreateEventButton from './CreateEventButton';

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [timeRange, setTimeRange] = useState({ start: 9, end: 18 });
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
    password,
  });

  return (
    <div>
      <EventTitleInput value={eventTitle} onChange={setEventTitle} />
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      <PasswordInput value={password} onChange={setPassword} />
      <CreateEventButton onClick={handleCreateEvent} />
    </div>
  );
};

export default CreateEventForm;
