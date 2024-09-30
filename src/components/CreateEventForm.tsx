'use client';

import { useState } from 'react';
import EventTitleInput from './EventTitleInput';
import CreateEventButton from './CreateEventButton';

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState('');

  const handleCreateEvent = () => {
    console.log('Event created:', {
      title: eventTitle,
    });
  };

  return (
    <div>
      <EventTitleInput value={eventTitle} onChange={setEventTitle} />
      <CreateEventButton onClick={handleCreateEvent} />
    </div>
  );
};

export default CreateEventForm;
