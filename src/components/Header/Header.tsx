import Image from 'next/image';
import logoImg from '../../../public/logo/main-logo.svg';
import { GoPlus } from 'react-icons/go';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Image src={logoImg} alt="Logo" width={40} height={40} />
          <span className="ml-2 text-xl font-bold">いつ会える？</span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/about" className="hover:underline">
                詳細
              </Link>
            </li>
            <li>
              <button
                className="bg-primary text-white px-4 py-2 rounded-md 
                hover:bg-primaryHover transition-colors flex items-center"
              >
                <GoPlus size={28} />
                新規イベント
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
