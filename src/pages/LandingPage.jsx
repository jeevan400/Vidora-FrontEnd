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
import Navbar from "../components/Navbar";
import NavMenu from "../components/NavMenu";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  let routeTo = useNavigate();

  const handleLogin = () => {
    routeTo("/auth");
  };

  const navtabs = [
    {
      icon: <AccountCircleIcon style={{ fontSize: "17px" }} />,
      text: "Join as Guest",
      onClick: () => {
        routeTo("/guest_user");
      },
      className: "",
    },
    {
      icon: <PersonAddIcon style={{ fontSize: "17px" }} />,
      text: "Register",
      onClick: handleLogin,
      className: "",
    },
    {
      icon: <LoginIcon style={{ fontSize: "17px" }} />,
      text: "Log in",
      onClick: handleLogin,
      className:
        "flex items-center gap-2 px-5 py-2 text-[13.5px] font-semibold text-[var(--background-color)] rounded-lg bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:from-[var(--gradient-end)] hover:to-[var(--gradient-start)] transition-all duration-150 shadow-sm !text-[var(--background-color)]",
    },
  ];
  return (
    <div className="min-h-screen bg-[var(--surface-color)] font-sans">
      <Navbar navtabs={navtabs} setIsMenuOpen={setIsMenuOpen} />

      {/*Mobile Slide-in Menu */}
      {isMenuOpen && (
        <NavMenu navtabs={navtabs} setIsMenuOpen={setIsMenuOpen} />
      )}
      <main className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-6 md:pb-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:max-w-[52%] flex flex-col items-start gap-5">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[var(--light-primary)] border border-[var(--gradient-start)] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gradient-start)] animate-pulse" />
              <span className="text-xs font-medium text-[var(--gradient-start)] tracking-wide">
                Now with real-time screen sharing
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-[2.6rem] md:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              Where conversations{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
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
            <p className="text-[var(--text-secondary)] text-[1.05rem] leading-relaxed max-w-lg">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--background-color)] border border-gray-200 rounded-full text-xs font-medium text-[var(--text-primary)] shadow-sm animate-pulse"
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
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[var(--background-color)] rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:from-[var(--gradient-end)] hover:to-[var(--gradient-start)] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-[1px]"
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
