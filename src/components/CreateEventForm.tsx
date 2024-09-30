'use client';

import { useState } from 'react';
import EventTitleInput from './EventTitleInput';
import CreateEventButton from './CreateEventButton';
import PasswordInput from './PasswordInput';

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateEvent = () => {
    console.log('Event created:', {
      title: eventTitle,
    });
  };

  return (
    <div>
      <EventTitleInput value={eventTitle} onChange={setEventTitle} />
      <PasswordInput value={password} onChange={setPassword} />
      <CreateEventButton onClick={handleCreateEvent} />
    </div>
  );
};

export default CreateEventForm;
