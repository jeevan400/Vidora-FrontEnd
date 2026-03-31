import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import VideocamIcon from "@mui/icons-material/Videocam";
import "../App.css";
import LogoImage from "../assets/vidoraImages/vidoraMainLogo.png";

function History() {
  const { getHistoryOfUser, deleteMeetingHistory } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);

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
  return (
    <div className="flex flex-col justify-center bg-gray-100">
      <nav className=" bg-white shadow-[0_4px_40px_0px_#0000004d] h-[60px] flex justify-between items-center px-4 mb-6 sticky top-0 z-10">
        <div className="navHeader">
          <img className="h-[50px]" src={LogoImage} alt="" />
        </div>
        <div className="navlist">
          <IconButton
            onClick={() => {
              routeTo("/home");
            }}
          >
            <HomeIcon style={{ color: "black" }} />
          </IconButton>
        </div>
      </nav>
      {meetings.map((meet) => {
        return (
          <>
            <div
              key={meet._id}
              className="flex justify-center items-center bg-gray-100 px-4 pb-4"
            >
              <div className="relative w-full rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300">
                <div className="bg-white rounded-2xl p-5 shadow-lg">
                  {/* <!-- Header --> */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 !text-[var(--primary-color)] flex justify-center items-center gap-2">
                      <VideocamIcon style={{ fontSize: "32px" }} />{" "}
                      <span>Meeting</span>
                    </h2>
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-semibold">
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
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-md transition">
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
