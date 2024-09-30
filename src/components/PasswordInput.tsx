interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="password" className="text-xl font-medium">
        パスワード（任意）
      </label>
      <p className="text-md">
        ご注意:
        パスワードが未設定の場合、イベントのリンクを入手した全ての人(リンクを推測した場合も含む)がイベントにアクセス可能です。
        ただし、リンクを入手した方々はパスワード入力の手間が省けるため、より簡単にアクセスできます。
      </p>
      <input
        type="password"
        id="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 px-4 py-2 w-full rounded-md border border-gray-300 shadow-sm"
      />
    </div>
  );
};

export default PasswordInput;
