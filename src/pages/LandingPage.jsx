import React, { useState } from "react";
import "../App.css";
import { Menu, X, ArrowRight, Video, Users, Monitor } from "lucide-react";
import mobileImage from "../assets/vidoraImages/mainLandingPageImage.png";
import { Link } from "react-router-dom";
import LogoImage from "../assets/vidoraImages/vidoraMainLogo.png";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  let routeTo = useNavigate();

  const handleLogin = () => {
    routeTo("/auth");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto px-5 h-[62px] flex items-center justify-between">
          <div className="flex items-center">
            <img className="h-[38px]" src={LogoImage} alt="Vidora logo" />
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => {
                routeTo("/guest_user");
              }}
              className="flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-150"
            >
              <AccountCircleIcon style={{ fontSize: "17px" }} />
              Join as Guest
            </button>
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-150"
            >
              <PersonAddIcon style={{ fontSize: "17px" }} />
              Register
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-5 py-2 text-[13.5px] font-semibold text-white rounded-lg bg-gray-900 hover:bg-gray-700 transition-all duration-150 shadow-sm"
            >
              <LoginIcon style={{ fontSize: "17px" }} />
              Log in
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={22} className="text-gray-600" />
          </button>
        </div>
      </nav>

      {/*Mobile Slide-in Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col"
            style={{ animation: "slideIn 0.22s cubic-bezier(0.4,0,0.2,1)" }}
          >
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to   { transform: translateX(0);    opacity: 1; }
              }
            `}</style>

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <img className="h-[32px]" src={LogoImage} alt="Vidora" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex flex-col px-3 py-4 gap-1">
              <button
                onClick={() => {
                  routeTo("/guest_user");
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <AccountCircleIcon
                    style={{ fontSize: "17px", color: "#6b7280" }}
                  />
                </span>
                Join as Guest
              </button>

              <button
                onClick={handleLogin}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <PersonAddIcon
                    style={{ fontSize: "17px", color: "#6b7280" }}
                  />
                </span>
                Register
              </button>
            </div>

            <div className="mt-auto px-5 pb-8">
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
              >
                <LoginIcon style={{ fontSize: "18px" }} />
                Log in to Vidora
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-6 md:pb-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:max-w-[52%] flex flex-col items-start gap-5">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-medium text-blue-600 tracking-wide">
                Now with real-time screen sharing
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-[2.6rem] md:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              Where conversations{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#4F84F6] to-[#5D58E0] bg-clip-text text-transparent">
                  come alive
                </span>
                {/* Decorative underline */}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M0 5 Q50 1 100 4 Q150 7 200 3"
                    stroke="url(#uline)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="uline" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4F84F6" />
                      <stop offset="100%" stopColor="#5D58E0" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Sub heading */}
            <p className="text-gray-500 text-[1.05rem] leading-relaxed max-w-lg">
              Vidora brings people together through smooth video calls,
              real-time messaging, and effortless screen sharing — making every
              conversation more immersive and impactful.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                { icon: <Video size={13} />, label: "HD Video" },
                { icon: <Users size={13} />, label: "Group Calls" },
                { icon: <Monitor size={13} />, label: "Screen Share" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm"
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>

            {/* buttons */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Link
                to="/auth"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#4F84F6] to-[#5D58E0] hover:from-[#3d74e8] hover:to-[#4a44d0] shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px]"
              >
                Get Started — it&apos;s free
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex w-full lg:flex-1 justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-blue-100/60 to-indigo-100/40 blur-2xl" />
              <img
                src={mobileImage}
                alt="Vidora app preview"
                className="relative w-full max-w-[480px] lg:max-w-[520px] drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
