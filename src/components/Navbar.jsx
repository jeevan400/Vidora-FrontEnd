import React from "react";
import { Menu } from "lucide-react";
import "../App.css";
import LogoImage from "../assets/vidoraImages/vidoraMainLogo.png";
import NavbarTab from "./NavbarTab";

function Navbar({ navtabs, setIsMenuOpen }) {
  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };
  return (
    <nav className="sticky top-0 z-50 bg-[var(--background-color)] border-b border-gray-200/80">
      <div className="max-w-6xl mx-auto px-5 h-[62px] flex items-center justify-between">
        <div className="flex items-center">
          <img className="h-[38px]" src={LogoImage} alt="Vidora logo" />
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          {navtabs?.map((navtab, index) => (
            <NavbarTab
              key={index}
              onClick={navtab.onClick}
              icon={navtab.icon}
              text={navtab.text}
              className={navtab.className}
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center text-[13px] font-bold text-[var(--background-color)] shadow-sm">
            A
          </div>
        </div>
        <button
          className="flex md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleMenuOpen}
        >
          <Menu size={22} className="text-gray-600" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
