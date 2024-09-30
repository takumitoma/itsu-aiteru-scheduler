interface EventTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const EventTitleInput: React.FC<EventTitleInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="eventTitle" className="text-xl font-medium">
        イベント名
      </label>
      <input
        type="text"
        id="eventTitle"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 px-4 py-2 w-full rounded-md border border-gray-300 shadow-sm"
        placeholder="例) テニスサークル・ボウリング大会"
      />
    </div>
  );
};

export default EventTitleInput;
