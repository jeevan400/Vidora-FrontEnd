import React from "react";
import { X } from "lucide-react";
import NavMenuTab from "./NavMenuTab";

function NavMenu({ navtabs, setIsMenuOpen }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={() => setIsMenuOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 right-0 w-72 h-full bg-[var(--background-color)] shadow-2xl flex flex-col"
        style={{ animation: "slideIn 0.22s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <style>{`
                  @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                  }
                `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center text-[14px] font-bold text-[var(--background-color)]">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">My Account</p>
              <p className="text-xs text-gray-400">Signed in</p>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex flex-col px-3 py-4 gap-1">
          {navtabs?.map((navtab, index) => (
            <NavMenuTab
              key={index}
              className={navtab.className}
              onClick={navtab.onClick}
              text={navtab.text}
              icon={navtab.icon}
            />
          ))}
          {/* <button
            onClick={() => {
              navigate("/history");
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <HistoryIcon style={{ fontSize: "17px", color: "#6b7280" }} />
            </span>
            History
          </button> */}

          {/* <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
              A
            </span>
            Profile
          </button> */}
        </div>

        {/* Logout pinned to bottom */}
        {/* <div className="mt-auto px-5 pb-8">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogoutIcon style={{ fontSize: "18px" }} />
            Log Out
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default NavMenu;
