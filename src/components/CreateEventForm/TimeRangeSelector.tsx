import { Slider } from '@mui/material';
import { useTimeFormatContext } from '@/providers/TimeFormatContext';
import { useTranslations } from 'next-intl';

const HOURS_24 = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const HOURS_12 = ['12', '3', '6', '9', '12', '3', '6', '9', '12'];

interface TimeRangeSelectorProps {
  value: { start: number; end: number };
  onChange: (value: { start: number; end: number }) => void;
  error?: string;
}

export function TimeRangeSelector({ value, onChange, error }: TimeRangeSelectorProps) {
  const { timeFormat } = useTimeFormatContext();
  const t = useTranslations('CreateEvent.TimeRangeSelector');

  function generateTimeMarks() {
    if (timeFormat === 24) {
      return HOURS_24.map((hour) => ({
        value: hour,
        label: hour.toString(),
      }));
    }

    // 12 hour format
    // internally use HOURS_24 but use HOURS_12 for display
    return HOURS_24.map((hour, index) => ({
      value: hour,
      label: HOURS_12[index],
    }));
  }

  function handleChange(_event: Event, newValue: number | number[]) {
    if (Array.isArray(newValue)) {
      let [start, end] = newValue.map(Math.round);

      // Restrict left slider to only go up to 23
      start = Math.min(start, 23);

      // Restrict right slider to only go down to 1
      end = Math.max(end, 1);

      // Prevent circles from overlapping
      if (end - start < 1) {
        if (start > value.start) {
          end = start + 1;
        } else {
          start = end - 1;
        }
      }

      onChange({ start, end });
    }
  }

  function formatTimeDisplay(hour: number) {
    if (timeFormat === 24) {
      return t('time24h', { hour });
    }

    if (hour === 0 || hour === 24) {
      return t('midnight');
    }
    if (hour === 12) {
      return t('noon');
    }

    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? t('am') : t('pm');

    return t('time12h', {
      hour: displayHour,
      period,
    });
  }

  return (
    <div className="w-full">
      <label className="mb-4">{t('label')}</label>
      <div className="my-4">
        <Slider
          value={[value.start, value.end]}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatTimeDisplay}
          min={0}
          max={24}
          marks={generateTimeMarks()}
          className="text-primary"
          sx={{
            '& .MuiSlider-thumb': {
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: 'none',
              },
            },
            '& .MuiSlider-rail': {
              borderRadius: '4px',
            },
            '& .MuiSlider-markLabel': {
              marginTop: '16px',
            },
            height: '16px',
          }}
        />
      </div>
      <p className="my-4 text-center text-lg">
        {formatTimeDisplay(value.start)} &#x2014; {formatTimeDisplay(value.end)}
      </p>
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
}
