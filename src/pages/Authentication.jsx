import * as React from "react";
import { AuthContext } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/vidoraImages/vidoraLogoImage.png";
import { Video, Users, Monitor, MessageSquare, ArrowRight } from "lucide-react";

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const router = useNavigate();
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        let result = await handleLogin(username, password);

        if (result) {
          router("/home", { state: { loginSuccess: true } });
        }
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setUsername("");
        setMessage(result);
        setOpen(true);
        setError("");
        setPassword("");
        setFormState(0);
      }
    } catch (err) {
      let message = err.response.data.message;
      setError(message);
    }
  };

  const features = [
    {
      icon: <Video size={16} />,
      text: "Make HD video calls (quality depends on your camera).",
    },
    {
      icon: <Users size={16} />,
      text: "Up to 4 people can join at the same time.",
    },
    {
      icon: <Monitor size={16} />,
      text: "Share your screen live during calls for learning, meetings, or explaining things.",
    },
    {
      icon: <MessageSquare size={16} />,
      text: "Send messages in real time. You can edit and reply to messages easily.",
    },
  ];

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left Panel — Brand ── */}
      <div className="hidden lg:flex w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-[var(--light-primary)]">
        {/* Gradient blobs */}
        <div className="absolute top-[-80px] left-[-60px] w-[340px] h-[340px] rounded-full bg-[#4F84F6]/20 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-40px] w-[280px] h-[280px] rounded-full bg-[#4F84F6]/20 blur-[80px] pointer-events-none" />
        <div className="absolute top-[45%] right-[10%] w-[180px] h-[180px] rounded-full bg-[#a78bfa]/10 blur-[60px] pointer-events-none" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Middle: Headline */}
        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="text-4xl font-extrabold text-[var(--text-primary)] leading-[1.2] tracking-tight">
            Meet, connect, and{" "}
            <span className="bg-gradient-to-r from-[#4F84F6] to-[#a78bfa] bg-clip-text text-transparent">
              collaborate
            </span>{" "}
            without limits.
          </h2>

          <p className="text-[var(--text-secondary)] text-[0.95rem] leading-relaxed max-w-sm">
            Vidora gives your team a single place for video meetings, real-time
            chat, and screen sharing — beautifully simple.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-3 mt-2">
            {features.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[var(--primary-color)] shrink-0">
                  {icon}
                </span>
                <span className="text-sm text-[var(--text-secondary)] font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#fafafa] flex flex-col justify-center items-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src={LogoImage} alt="Vidora" className="h-[34px]" />
        </div>

        <div className="w-full max-w-[400px] flex flex-col gap-7">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {formState === 0 ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              {formState === 0
                ? "Sign in to continue to Vidora"
                : "Get started for free — no credit card required"}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => {
                setFormState(0);
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                formState === 0
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setFormState(1);
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                formState === 1
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Full Name — only on signup */}
            {formState === 1 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                />
              </div>
            )}

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                autoFocus={formState === 0}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password
                </label>
                {formState === 0 && (
                  <span className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer font-medium">
                    Forgot password?
                  </span>
                )}
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="button"
              onClick={handleAuth}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#4F84F6] to-[#5D58E0] hover:from-[#3d74e8] hover:to-[#4a44d0] shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px] mt-1"
            >
              {formState === 0 ? "Sign in to Vidora" : "Create Account"}
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Switch form hint */}
          <p className="text-center text-sm text-[var(--text-secondary)]">
            {formState === 0
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setFormState(formState === 0 ? 1 : 0);
                setError("");
              }}
              className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
            >
              {formState === 0 ? "Sign up free" : "Sign in"}
            </button>
          </p>

          {/* Footer note */}
          <p className="text-center text-xs text-[var(--text-secondary)] -mt-3">
            &copy;
            2026 Vidora. All rights reserved.
          </p>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={1000}
        message={message}
        onClose={handleClose}
      />
    </div>
  );
}
