import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import VideocamIcon from "@mui/icons-material/Videocam";
import "../App.css";
import Navbar from "../components/Navbar";
import NavMenu from "../components/NavMenu";

function History() {
  const { getHistoryOfUser, deleteMeetingHistory } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (e) {
        console.log(e);
      }
    };

    fetchHistory();
  }, []);

  const handleMeetingHistoryDelete = async (id) => {
    await deleteMeetingHistory(id);
    setMeetings((prevMeetings) =>
      prevMeetings.filter((meet) => meet._id !== id),
    );
  };

  const navtabs = [
    {
      icon: (
        <HomeIcon
          style={{ color: "var(--text-secondary)", fontSize: "17px" }}
        />
      ),
      text: "Home",
      onClick: () => {
        routeTo("/home");
      },
      className: "",
    },
  ];
  return (
    <div className="flex flex-col justify-center bg-gray-100">
      <Navbar navtabs={navtabs} setIsMenuOpen={setIsMenuOpen} />

      {isMenuOpen && (
        <NavMenu navtabs={navtabs} setIsMenuOpen={setIsMenuOpen} />
      )}

      {meetings.map((meet) => {
        return (
          <>
            <div
              key={meet._id}
              className="flex justify-center items-center bg-gray-100 px-4 pb-4"
            >
              <div className="relative w-full rounded-2xl p-[2px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-300">
                <div className="bg-[var(--background-color)] rounded-2xl p-5 shadow-lg">
                  {/* <!-- Header --> */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 !text-[var(--primary-color)] flex justify-center items-center gap-2">
                      <VideocamIcon style={{ fontSize: "32px" }} />{" "}
                      <span>Meeting</span>
                    </h2>
                    <span className="text-xs px-3 py-1 bg-[var(--light-primary)] text-[var(--gradient-start)] rounded-full font-semibold">
                      Completed
                    </span>
                  </div>

                  {/* <!-- Meeting Code --> */}
                  <div className="flex flex-col sm:!flex-row sm:justify-between sm:items-center">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Meeting Code</p>
                      <p className="text-lg font-semibold text-gray-800 tracking-wider">
                        {meet.meetingCode}
                      </p>
                    </div>
                    {/* <!-- User --> */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Username</p>
                      <p className="text-sm font-medium text-gray-700">
                        {meet.user_id}
                      </p>
                    </div>

                    {/* <!-- Date --> */}
                    <div className="mb-5">
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(meet.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* <!-- Buttons --> */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        routeTo(`/${meet.meetingCode}`);
                      }}
                      className="flex-1 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:from-[var(--gradient-end)] hover:to-[var(--gradient-start)] text-[var(--background-color)] py-2 rounded-lg text-sm font-semibold hover:shadow-md transition"
                    >
                      Join
                    </button>
                    <button
                      onClick={() => handleMeetingHistoryDelete(meet._id)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default History;
