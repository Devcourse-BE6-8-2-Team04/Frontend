import Link from 'next/link';
import { Search, Home, ShoppingBag, Menu } from 'lucide-react';

export default function NavBar() {
  return (
    <div className="absolute w-[390px] h-[73px] bottom-0 left-0 bg-white flex justify-around items-center">
      <Link href="/">
        <Search className="w-6 h-6 cursor-pointer" />
      </Link>
      <Link href="/clothdetail">
        <Home className="w-6 h-6 cursor-pointer" />
      </Link>
      <Link href="/clothdetail">
        <ShoppingBag className="w-6 h-6 cursor-pointer" />
      </Link>
      <Link href="/plan">
        <Menu className="w-6 h-6 cursor-pointer" />
      </Link>
    </div>
  );
}
