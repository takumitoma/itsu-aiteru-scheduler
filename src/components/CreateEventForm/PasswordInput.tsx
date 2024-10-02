import { useState } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  function toggleTooltip() {
    setShowTooltip(prev => !prev);
  }

  return (
    <div className="max-w-md w-full">
      <div className="flex items-center mb-2">
        <label htmlFor="password" className="text-xl font-medium mr-2">
          {"パスワード (任意)"}
        </label>
        <button
          type="button"
          onClick={toggleTooltip}
        >
          <IoIosInformationCircleOutline size={24} />
        </button>
      </div>
      {showTooltip && (
        <div className="bg-gray-100 border border-gray-300 p-3 rounded-md mb-3 text-sm">
          <p>
            ご注意:
            パスワードが未設定の場合、イベントのリンクを入手した全ての人(リンクを推測した場合も含む)がイベントにアクセス可能です。
            ただし、リンクを入手した方々はパスワード入力の手間が省けるため、より簡単にアクセスできます。
          </p>
        </div>
      )}
      <input
        type="password"
        id="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 px-4 py-2 w-full rounded-md border border-gray-300 shadow-sm"
      />
    </div>
  );
};

export default PasswordInput;
