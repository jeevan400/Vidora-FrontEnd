import React from "react";

function NavMenuTab({ onClick, className, icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] rounded-xl hover:bg-gray-50 transition-colors text-left ${className}`}
    >
      <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
        {icon}
      </span>
      {text}
    </button>
  );
}

export default NavMenuTab;
