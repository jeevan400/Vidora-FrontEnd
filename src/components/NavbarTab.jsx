import React from "react";
import { useNavigate } from "react-router-dom";

function NavbarTab({ icon, text, onClick, className }) {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-150 ${className}`}
      >
        {icon}
        {text}
      </button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
    </>
  );
}

export default NavbarTab;
