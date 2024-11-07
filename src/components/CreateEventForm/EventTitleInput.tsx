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
      <label htmlFor="eventTitle">イベント名</label>
      <input
        type="text"
        id="eventTitle"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          isInteracted.current = true;
        }}
        className={`mt-4 ${displayError ? 'border-2 border-red-500' : 'border border-primary'}`}
        placeholder="例) テニスサークル・ボウリング大会"
      />
      <p className={`mt-2 px-4 text-red-500 ${displayError ? '' : 'hidden'}`}>
        イベント名を入力してください
      </p>
    </div>
  );
};

export default EventTitleInput;
