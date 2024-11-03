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
    <div className="w-full">
      <label htmlFor="eventTitle" className="text-lg sm:text-xl font-medium">
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
        className={`mt-4 px-4 py-2 w-full rounded-md shadow-sm bg-primaryVeryLight text-customBlack
          focus:outline-none focus:ring-2 focus:ring-primary ${
            displayError ? 'border-2 border-red-500' : 'border border-primary'
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
