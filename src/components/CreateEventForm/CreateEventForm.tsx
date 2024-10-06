'use client';

import { useState, useRef } from 'react';
import EventTitleInput from './EventTitleInput';
import SurveyTypeSelector from './SurveyTypeSelector';
import TimezoneSelector from './TimezoneSelector';
import TimeRangeSelector from './TimeRangeSelector';
import Calendar from './Calendar';
import WeekCalendar from './WeekCalendar';
import CreateEventButton from './CreateEventButton';
import dayjs from 'dayjs';
import { createEvent } from '@/app/api/create-event/route';

const CreateEventForm: React.FC = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [surveyType, setSurveyType] = useState<'specific' | 'week'>('specific');
  const [timeRange, setTimeRange] = useState({ start: 9, end: 18 });
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Tokyo');
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function formIsValid() {
    if (eventTitle.trim().length === 0) {
      return false;
    }
    if (surveyType === 'specific' && selectedDates.length === 0) {
      return false;
    }
    if (surveyType === 'week' && !selectedDaysOfWeek.includes(1)) {
      return false;
    }
    if (honeypotRef.current && honeypotRef.current.checked) {
      return false;
    }
    return true;
  }

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formIsValid()) {
      setIsSubmitting(true);
      try {
        const eventData = {
          title: eventTitle,
          surveyType,
          timeRange: {
            start: timeRange.start,
            end: timeRange.end,
          },
          timezone: selectedTimezone,
          dates:
            surveyType === 'specific'
              ? selectedDates.map((date) => dayjs(date).startOf('day').toISOString())
              : undefined,
          daysOfWeek: surveyType === 'week' ? selectedDaysOfWeek : undefined,
        };

        const result = await createEvent(eventData);
        console.log('Event created:', result);

        // todo: add redirect logic here
      } catch (error) {
        console.error('Error creating event:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Error: Form validation failed');
      setShowErrors(true);
    }
  }

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16 max-w-[60rem]"
      onSubmit={handleCreateEvent}
    >
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
        <CreateEventButton isSubmitting={isSubmitting} />
      </div>

      <div className="hidden md:block md:order-2"></div>

      {/* Honeypot */}
      <input
        type="checkbox"
        name="contact_me_by_fax_only"
        ref={honeypotRef}
        tabIndex={-1}
        className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    </form>
  );
};

export default CreateEventForm;
