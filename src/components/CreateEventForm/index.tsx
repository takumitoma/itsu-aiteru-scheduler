'use client';

import { useState, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EventTitleInput } from './EventTitleInput';
import { SurveyTypeSelector } from './SurveyTypeSelector';
import { TimezoneSelector } from './TimezoneSelector';
import { TimeRangeSelector } from './TimeRangeSelector';
import { Calendar } from './Calendar';
import { WeekCalendar } from './WeekCalendar';
import { CreateEventButton } from './CreateEventButton';
import { ErrorMessage } from './ErrorMessage';
import dayjs from 'dayjs';
import { createEvent } from '@/lib/api-client/event';
import { Event } from '@/types/Event';

const schema = z
  .object({
    eventTitle: z.string().min(1),
    surveyType: z.enum(['specific', 'week']),
    timeRange: z.object({
      start: z.number().min(0).max(23),
      end: z.number().min(1).max(24),
    }),
    selectedDates: z.array(z.string()),
    selectedDaysOfWeek: z.array(z.number()),
    selectedTimezone: z.string(),
  })
  .refine(
    (data) => {
      if (data.surveyType === 'specific') {
        return data.selectedDates.length > 0;
      }
      return true;
    },
    {
      path: ['selectedDates'],
    },
  )
  .refine(
    (data) => {
      if (data.surveyType === 'week') {
        return data.selectedDaysOfWeek.includes(1);
      }
      return true;
    },
    {
      path: ['selectedDaysOfWeek'],
    },
  );

type FormFields = z.infer<typeof schema>;

export function CreateEventForm() {
  const t = useTranslations('CreateEvent.CreateEventForm');
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const honeypotRef = useRef<HTMLInputElement>(null);

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventTitle: '',
      surveyType: 'specific',
      timeRange: { start: 9, end: 18 },
      selectedDates: [],
      selectedDaysOfWeek: [0, 0, 0, 0, 0, 0, 0],
      selectedTimezone: 'Asia/Tokyo',
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = methods;

  const surveyType = watch('surveyType');

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setApiError(null);
    try {
      if (honeypotRef.current?.checked) {
        throw Error('honeypot');
      }
      const event: Omit<Event, 'id' | 'createdAt'> = {
        title: data.eventTitle,
        surveyType: data.surveyType,
        timeRangeStart: data.timeRange.start,
        timeRangeEnd: data.timeRange.end,
        timezone: data.selectedTimezone,
        dates:
          data.surveyType === 'specific'
            ? data.selectedDates.map((date) => dayjs(date).startOf('day').toISOString())
            : null,
        daysOfWeek: data.surveyType === 'week' ? data.selectedDaysOfWeek : null,
      };

      const createdEventId = await createEvent(event);
      router.push(`/e/${createdEventId}`);
    } catch (error) {
      console.error('Error creating event:', error);
      setApiError(error instanceof Error ? error.message : t('unknownError'));
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:order-1">
          <EventTitleInput register={register('eventTitle')} error={errors.eventTitle?.message} />
        </div>

        <div className="md:order-4">
          <TimezoneSelector register={register('selectedTimezone')} />
        </div>

        {/* Controller because TimeRangeSelector uses MUI */}
        <div className="md:order-6">
          <Controller
            name="timeRange"
            control={control}
            render={({ field }) => (
              <TimeRangeSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.timeRange?.message}
              />
            )}
          />
        </div>

        <div className="md:order-3">
          <SurveyTypeSelector register={register('surveyType')} />
        </div>

        {/* Too complex for register */}
        <div className="md:order-5">
          {surveyType === 'specific' ? (
            <Calendar error={errors.selectedDates?.message} />
          ) : (
            <WeekCalendar error={errors.selectedDaysOfWeek?.message} />
          )}
        </div>

        {apiError && (
          <div className="md:order-7 md:col-span-2">
            <ErrorMessage />
          </div>
        )}

        <div className="md:order-8 md:col-span-2">
          <CreateEventButton />
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
    </FormProvider>
  );
}
