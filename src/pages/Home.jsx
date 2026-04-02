import React, { useContext } from "react";
import { ArrowRight } from "lucide-react";
import "../App.css";
import HistoryIcon from "@mui/icons-material/History";
import homeImage from "../assets/vidoraImages/homeImageMain2.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth";
import { useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import NavMenu from "../components/NavMenu";

function Home() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  // it show only one time toast because react strict mood run useEffect two
  const shownToast = useRef(false);

  useEffect(() => {
    if (location.state?.loginSuccess && !shownToast.current) {
      toast.success("User Login Successful!");

      shownToast.current = true;
      // clear state because when user is not login and you refresh the home page and go to the home page then it show user login successfully then clean the state
      window.history.replaceState({}, document.title);
    }
  }, []);
  const [meetingCode, setMeetingCode] = React.useState("");

  const navigate = useNavigate();
  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const navtabs = [
    {
      icon: <HistoryIcon style={{ fontSize: "17px" }} />,
      text: "History",
      onClick: () => {
        navigate("/history");
      },
      className: "",
    },
    {
      icon: <LogoutIcon style={{ fontSize: "17px" }} />,
      text: "Log Out",
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/auth");
      },
      className:
        "hover:bg-red-50 hover:text-red-500 transition-all duration-150",
    },
  ];
  return (
    <div className="min-h-screen bg-[var(--surface-color)] font-sans flex flex-col">
      <Navbar navtabs={navtabs} setIsMenuOpen={setIsMenuOpen} />

      {/*Mobile Slide-in Menu */}
      {isMenuOpen && (
        <NavMenu navtabs={navtabs} setIsMenuOpen={setIsMenuOpen} />
      )}

      {/*Main Content*/}
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-12 md:py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="w-full lg:w-[45%] flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gradient-start)] animate-pulse" />
              <span className="text-xs font-medium text-[var(--gradient-start)] tracking-wide uppercase">
                Quick Start
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
              Start or join a{" "}
              <span className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                meeting
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Create a new room instantly or enter a code to join an existing
              session.
            </p>
          </div>

          {/* Card */}
          <div className="bg-[var(--background-color)] rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Meeting Name or Code
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                type="text"
                onChange={(e) => setMeetingCode(e.target.value)}
                placeholder="e.g. team-standup or abc-defg-hij"
              />
            </div>
            <button
              onClick={handleJoinVideoCall}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[var(--background-color)] rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:from-[var(--gradient-end)] hover:to-[var(--gradient-start)] shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px]"
            >
              Create a Meeting
              <ArrowRight size={15} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-700 rounded-xl border border-gray-200 bg-[var(--background-color)] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-150">
              Join with a Code
            </button>
          </div>
        </div>
        <div className="hidden md:flex w-full lg:flex-1 justify-center lg:justify-end items-center">
          <div className="relative w-full max-w-[480px] lg:max-w-[520px]">
            <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-blue-100/60 to-indigo-100/40 blur-2xl" />
            <img
              src={homeImage}
              alt="home image"
              className="relative w-full drop-shadow-xl rounded-2xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Home);
