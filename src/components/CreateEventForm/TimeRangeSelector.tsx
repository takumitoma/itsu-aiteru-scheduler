import { Slider } from '@mui/material';

interface TimeRangeSelectorProps {
  value: { start: number; end: number };
  onChange: (value: { start: number; end: number }) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const handleChange = (event: Event, newValue: number | number[]) => {
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
  };

  const marks = [
    { value: 0, label: '0時' },
    { value: 6, label: '6時' },
    { value: 12, label: '12時' },
    { value: 18, label: '18時' },
    { value: 24, label: '24時' },
  ];

  return (
    <div className="w-full">
      <label className="text-xl font-medium mb-4">時間帯を選択</label>
      <div className="my-4">
        <Slider
          value={[value.start, value.end]}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(hour: number) => `${Math.round(hour)}時`}
          min={0}
          max={24}
          marks={marks}
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
      <p className="text-lg text-center my-4">
        {value.start}時 &#x2014; {value.end}時
      </p>
    </div>
  );
};

export default TimeRangeSelector;
