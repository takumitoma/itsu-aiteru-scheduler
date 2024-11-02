import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold hidden sm:block">いつ空いてる？</span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/about" className="hover:underline text-xl">
                詳細
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
