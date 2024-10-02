import { Slider } from '@mui/material';

interface TimeRangeSelectorProps {
  value: { start: number; end: number };
  onChange: (value: { start: number; end: number }) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      let [start, end] = newValue.map(Math.round);

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
    <div className="max-w-md w-full px-2">
      <label className="text-xl font-medium mb-4">時間帯を選択</label>
      <p className="mb-4">
        {value.start}時 から {value.end}時
      </p>
      <Slider
        value={[value.start, value.end]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(hour: number) => `${Math.round(hour)}時`}
        min={0}
        max={24}
        marks={marks}
        className="text-primary"
      />
    </div>
  );
};

export default TimeRangeSelector;
