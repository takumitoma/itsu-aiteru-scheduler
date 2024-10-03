import { useRef } from 'react';

interface EventTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const EventTitleInput: React.FC<EventTitleInputProps> = ({ value, onChange }) => {
  const isInteracted = useRef(false);

  const showError = isInteracted.current && value.length === 0;

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
        className="mt-4 px-4 py-2 w-full rounded-md border border-gray-300 shadow-sm"
        placeholder="例) テニスサークル・ボウリング大会"
      />
      <p className={`mt-2 px-4 text-red-500 ${showError ? '' : 'hidden'}`}>
        イベント名を入力してください
      </p>
    </div>
  );
};

export default EventTitleInput;
