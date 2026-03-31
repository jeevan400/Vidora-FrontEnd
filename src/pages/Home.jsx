import React, { useContext } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import "../App.css";
import LogoImage from "../assets/vidoraImages/vidoraMainLogo.png";
import HistoryIcon from "@mui/icons-material/History";
import homeImage from "../assets/vidoraImages/homeImageMain2.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth";
import { useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

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

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto px-5 h-[62px] flex items-center justify-between">
          <div className="flex items-center">
            <img className="h-[38px]" src={LogoImage} alt="Vidora logo" />
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => {
                navigate("/history");
              }}
              className="flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-150"
            >
              <HistoryIcon style={{ fontSize: "17px" }} />
              History
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
              className="flex items-center gap-2 px-4 py-2 text-[13.5px] font-medium text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all duration-150"
            >
              <LogoutIcon style={{ fontSize: "17px" }} />
              Log Out
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F84F6] to-[#5D58E0] flex items-center justify-center text-[13px] font-bold text-white shadow-sm">
              A
            </div>
          </div>
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

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F84F6] to-[#5D58E0] flex items-center justify-center text-[14px] font-bold text-white">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    My Account
                  </p>
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
              <button
                onClick={() => {
                  navigate("/history");
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <HistoryIcon style={{ fontSize: "17px", color: "#6b7280" }} />
                </span>
                History
              </button>

              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  A
                </span>
                Profile
              </button>
            </div>

            {/* Logout pinned to bottom */}
            <div className="mt-auto px-5 pb-8">
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
            </div>
          </div>
        </div>
      )}

      {/*Main Content*/}
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-12 md:py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="w-full lg:w-[45%] flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-medium text-blue-600 tracking-wide uppercase">
                Quick Start
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Start or join a{" "}
              <span className="bg-gradient-to-r from-[#4F84F6] to-[#5D58E0] bg-clip-text text-transparent">
                meeting
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Create a new room instantly or enter a code to join an existing
              session.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
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
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#4F84F6] to-[#5D58E0] hover:from-[#3d74e8] hover:to-[#4a44d0] shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px]"
            >
              Create a Meeting
              <ArrowRight size={15} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-700 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-150">
              Join with a Code
            </button>
          </div>
        </div>
        <div className="hidden md:flex w-full lg:flex-1 justify-center lg:justify-end">
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
