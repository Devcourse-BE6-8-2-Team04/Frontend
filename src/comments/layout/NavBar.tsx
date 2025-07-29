import React from "react";
import { Home, Search, ShoppingBag, Menu } from "lucide-react";

export default function NavBar() {
  return (
    <div className="absolute w-[390px] h-[73px] bottom-0 left-0 bg-white flex justify-around items-center">
      <Search className="w-6 h-6" />
      <Home className="w-6 h-6" />
      <ShoppingBag className="w-6 h-6" />
      <Menu className="w-6 h-6" />
    </div>
  );
}
