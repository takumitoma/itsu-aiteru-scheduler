import { useRef } from 'react';

interface EventTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}

const EventTitleInput: React.FC<EventTitleInputProps> = ({ value, onChange, showError }) => {
  const isInteracted = useRef(false);

  const displayError = (showError || isInteracted.current) && value.trim().length === 0;

  return (
    <div className="max-w-md w-full">
      <label htmlFor="eventTitle" className="text-xl font-medium">
        イベント名
      </label>
      <input
        type="text"
        id="eventTitle"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          isInteracted.current = true;
        }}
        className={`mt-4 px-4 py-2 w-full rounded-md shadow-sm ${
          displayError ? 'border-2 border-red-500' : 'border border-gray-300'
        }`}
        placeholder="例) テニスサークル・ボウリング大会"
      />
      <p className={`mt-2 px-4 text-red-500 ${displayError ? '' : 'hidden'}`}>
        イベント名を入力してください
      </p>
    </div>
  );
};

export default EventTitleInput;
