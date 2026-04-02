import { useEffect, useRef, useState } from "react";
import styles from "../styles/videoComponent.module.css";
import io from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamoffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import vIcon from "../assets/vidoraImages/V_icon.png";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { nanoid } from "nanoid";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import server from "../environment";
import { X } from "lucide-react";

const server_url = server;

let connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoMeetComponent() {
  let socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef();
  const videoRef = useRef([]);
  const messageEndRef = useRef(null);
  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setShowModal] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState();
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  let [videos, setVideos] = useState([]);
  let [sender, setSender] = useState();
  let [contextMenu, setContextMenu] = useState();
  let [reply, setReply] = useState(false);
  let [replyData, setReplyData] = useState({});
  let routeTo = useNavigate();
  const getPermissions = async () => {
    try {
      // video permission
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      // audio permission
      const audioPetmission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPetmission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      // display media
      // check if screen sharing API (getDisplayMedia) is supported by the browser
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoVRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          // blackSilence
          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }),
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });

    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  // Function to start or stop user media ( camera / micraophone)
  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((err) => console.log(err));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  // Function that will handle signaling messages coming from the server
  let gotMesssageFromServer = (fromId, message) => {
    let signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      // if the message contains ICE candidate
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: sender,
        replyTo: data.replyTo ? data.replyTo : null,
        data: data.text,
        currentUser: socketIdSender,
        date: Date.now(),
        msg_id: data.msg_id,
      },
    ]);

    if (socketIdSender === socketIdRef.current) {
      setSender(socketIdSender);
    }
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevMessages) => prevMessages + 1);
    }
  };

  // Function used to connect the client to the socket signaling server
  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });
    socketRef.current.on("signal", gotMesssageFromServer);
    socketRef.current.on("connect", () => {
      toast.success("User connected successfully!");
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;
      socketRef.current.on("chat-message", addMessage);

      // edit message on user B side
      socketRef.current.on("edit-message", (data) => {
        setMessages((prev) =>
          prev.map((item) =>
            item.msg_id === data.id ? { ...item, data: data.message } : item,
          ),
        );
      });

      // delete message
      socketRef.current.on("delete-message", (id) => {
        setMessages((prev) => prev.filter((item) => item.msg_id !== id));
      });

      // set limit of the user
      socketRef.current.on("room-full", () => {
        toast.error("Meeting is full.");
        routeTo("/home");
      });

      // Event triggered when a new user joins the meeting
      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          // Handle ICE candidate generation
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          // Event triggered when a remote user stream is received
          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video,
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsinline: true,
              };

              // Add the new video to the list of videos
              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Check if local camera/microphone stream is available
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log(e);
            }

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });

    socketRef.current.on("user-left", (id) => {
      toast.success("User left the call!");
      setVideos((videos) => videos.filter((video) => video.socketId !== id));
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
  };

  // Function that runs when the user clicks the "Connect" button
  let connect = () => {
    setAskForUsername(false);
    getMedia();
    connectToSocketServer();
  };

  const handleVideo = () => {
    setVideo(!video);
  };
  const handleAudio = () => {
    setAudio(!audio);
  };

  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoVRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          // TODO BlackSilence
          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleChatBox = () => {
    setShowModal(!showModal);
    setNewMessages(0);
  };

  let sendMessage = () => {
    const messageData = {
      text: message,
      replyTo: reply ? replyData : null,
      msg_id: nanoid(),
    };

    socketRef.current.emit("chat-message", messageData, username);
    setMessage("");
    setReply(false);
    setReplyData({});
  };

  let scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(() => {
    if (showModal) {
      scrollToBottom();
    }
  }, [showModal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isEdit, setIsEdit] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(null);
  const [updatedMessageId, setUpdatedMessageId] = useState(null);
  let handleStartEdit = (id) => {
    setIsEdit(true);
    const selectedMessage = messages.find((item) => item.msg_id === id);
    if (selectedMessage) {
      setMessage(selectedMessage.data);
      setUpdatedMessageId(selectedMessage.msg_id);
    }
  };
  let handleUpdatMessage = () => {
    // send to server
    socketRef.current.emit("edit-message", {
      id: updatedMessageId,
      message: message,
    });

    //local update
    setMessages((prev) =>
      prev.map((item) =>
        item.msg_id === updatedMessageId ? { ...item, data: message } : item,
      ),
    );
    setIsEdit(false);
    setUpdatedMessageId(null);
    setMessage("");
  };

  // handle delete message
  let handleDeleteMessage = (id) => {
    console.log("message deleted successfully");
    socketRef.current.emit("delete-message", {
      id: id,
      socketId: socketIdRef.current,
    });
  };

  // handle reply
  let handleReply = (id) => {
    const selectedMessage = messages.find((item) => item.msg_id === id);

    if (selectedMessage) {
      setReplyData((prev) => ({
        ...prev,
        user: selectedMessage.sender,
        data: selectedMessage.data,
      }));
      setReply(true);
    }
  };

  let handleEndCall = () => {
    try {
      // stop camera + mic
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }

      // stop global stream
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
        window.localStream = null;
      }

      // Close all peer connections
      for (let id in connections) {
        connections[id]?.close();
        delete connections[id];
      }

      // disconnect socket ( most important)
      if (socketRef.current) {
        socketRef.current.emit("leave-call", null, () => {
          socketRef.current.disconnect();
        });
      }

      toast.success("Call ended!");
    } catch (e) {
      console.log(e);
      toast.error("Error ending call.");
    }

    setTimeout(() => {
      routeTo("/home");
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setReply(false);
      setReplyData({});
      setIsEdit(false);
    }
  };

  // for mobile when user trigger long press
  const [pressTimer, setPressTimer] = useState(null);

  // to detect delay
  const handleTouchStart = (item) => {
    const timer = setTimeout(() => {
      setContextMenu(item.msg_id);
    }, 500);

    setPressTimer(timer);
  };
  // to cancle if released early
  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div onClick={() => setContextMenu(null)}>
      {askForUsername === true ? (
        <div className={styles.lobbyContainer}>
          <div className="h-full flex-1 flex justify-center items-stretch">
            <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] w-full rounded-lg p-[2px] flex justify-center items-center">
              <div className="bg-[var(--background-color)] h-full w-full rounded-lg flex justify-center items-center">
                <div className=" bg-[var(--background-color)] w-full rounded-lg flex flex-col justify-between items-center p-6">
                  <div className={styles.logoImage}>
                    <h1 className="!text-3xl md:!text-4xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
                      Welcome to
                    </h1>
                    <div className="flex justify-center items-center">
                      <img src={vIcon} alt="logo" />
                      <h1 className="!text-3xl md:!text-4xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                        idora
                      </h1>
                    </div>
                  </div>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[var(--gradient-end)] focus:ring-0 focus:ring-blue-100 transition-all duration-150 my-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                  />
                  <div className={styles.formMainContent}>
                    <h2 className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                      Enter the Meeting Room
                    </h2>
                    <p className="text-[var(--text-secondary)] text-xs fontsem mt-2 leading-relaxed">
                      Join the meeting and start seamless communication in
                      seconds.
                    </p>
                  </div>
                  <button
                    onClick={connect}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[var(--background-color)] rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] hover:from-[var(--gradient-end)] hover:to-[var(--gradient-start)] shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px]"
                  >
                    Create a Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.lobbyStream}>
            <video
              className="border border-[var(--border-color)]"
              ref={localVideoRef}
              autoPlay
              muted
            ></video>
            <div className="w-[97%] h-[90%] absolute top-4 left-4 flex flex-col justify-start gap-2">
              <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] w-[60%] md:w-fit px-4 py-2 rounded-lg border border-[var(--background-color)] shadow-[0_0_20px_#4f46e56d] text-[var(--background-color)] font-light  ">
                <h1 className="text-[16px] font-bold">Audio</h1>
                <p className="text-[12px] font-light">
                  Clear and smooth voice communication.
                </p>
              </div>
              <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] w-[70%] md:w-fit px-4 py-2 rounded-lg border border-[var(--background-color)] shadow-[0_0_20px_#4f46e56d] text-[var(--background-color)] font-light ">
                <h1 className="text-[16px] font-bold">Video</h1>
                <p className="text-[12px] font-light">
                  Connect face-to-face with live video.
                </p>
              </div>
              <div className="absolute top-4 right-6">
                <img
                  className="h-8 w-8 rounded-full border border-[var(--background-color)]"
                  src={vIcon}
                  alt="logo"
                />
              </div>
              <div className=" w-[60%] md:w-fit px-4 py-2 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-lg text-[var(--background-color)]  border border-[var(--background-color)] shadow-[0_0_20px_#4f46e56d]">
                <h1 className="text-[16px] font-bold">Chat</h1>
                <p className="text-[12px] font-light">
                  Send quick messages during the meeting
                </p>
              </div>
              <div className="w-[80%] md:w-fit px-4 py-2 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-lg text-[var(--background-color)] border border-[var(--background-color)] shadow-[0_0_20px_#4f46e56d]">
                <h1 className="text-[16px] font-bold">Screen Share</h1>
                <p className="text-[12px] font-light">
                  Share your screen for easy collaboration.
                </p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className={styles.meetVideoContainer}>
          <video
            className={styles.meetUserVideo}
            ref={localVideoRef}
            autoPlay
            muted
          ></video>
          <div className={styles.conferenceView}>
            {videos.map((video) => (
              <video
                key={video.socketId}
                className={styles.conferenceUsers}
                data-socket={video.socketId}
                ref={(ref) => {
                  if (ref && video.stream) {
                    ref.srcObject = video.stream;
                  }
                }}
                autoPlay
              ></video>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <div className="bg-[var(--background-color)]/20 px-4 sm:px-6 py-2 rounded-full border border-[var(--border-color)] shadow-lg flex justify-between items-center gap-2 sm:gap-4 flex-wrap">
              <IconButton onClick={handleVideo}>
                {video === true ? (
                  <VideocamIcon style={{ color: "var(--primary-hover)" }} />
                ) : (
                  <VideocamoffIcon />
                )}
              </IconButton>
              <IconButton onClick={handleEndCall}>
                <CallEndIcon style={{ color: "red" }} />
              </IconButton>
              <IconButton onClick={handleAudio}>
                {audio === true ? (
                  <MicIcon style={{ color: "var(--primary-hover)" }} />
                ) : (
                  <MicOffIcon />
                )}
              </IconButton>
              {screenAvailable === true ? (
                <IconButton onClick={handleScreen}>
                  {screen === true ? (
                    <ScreenShareIcon
                      style={{ color: "var(--primary-hover)" }}
                    />
                  ) : (
                    <StopScreenShareIcon />
                  )}
                </IconButton>
              ) : (
                <></>
              )}
              <Badge badgeContent={newMessages} max={999} color="secondary">
                <IconButton onClick={handleChatBox}>
                  {showModal ? (
                    <ChatIcon style={{ color: "var(--primary-hover)" }} />
                  ) : (
                    <ChatIcon />
                  )}
                </IconButton>
              </Badge>
            </div>
          </div>
          {showModal ? (
            <div className={styles.chatRoom}>
              <h1 className="w-full flex justify-between items-center bg-[var(--background-color)] w-fit px-4 py-1 rounded-full">
                <div className="flex justify-center items-center">
                  <img className="h-8 w-8 rounded-full" src={vIcon} alt="logo" />
                  <span className="text-[18px] text-[#060606] font-bold">
                    idora Chat
                  </span>
                </div>
                <div 
                onClick={()=>setShowModal(false)}
                className="w-fit h-fit p-[5px] rounded-md flex justify-center items-center hover:bg-gray-200 transition-all duration-200 ease-in text-[var(--text-primary)] cursor-pointer"
                >
                <X size={18}/>
              </div>
              </h1>
              <div className={styles.chatBox}>
                {messages.length > 0 ? (
                  messages.map((item, index) => {
                    return item.currentUser === sender ? (
                      <div
                        onContextMenu={(e) => {
                          e.preventDefault(); // remove default browser contextMenu
                          setContextMenu(item.msg_id);
                        }}
                        onTouchStart={() => handleTouchStart(item)}
                        onTouchEnd={handleTouchEnd}
                        className="relative w-full flex justify-end items-center gap-2"
                        key={item.msg_id}
                      >
                        {contextMenu === item.msg_id ? (
                          <div className="w-fit rounded-lg bg-[var(--light-primary)] flex flex-col justify-between items-center">
                            <div
                              onClick={() => handleStartEdit(item.msg_id)}
                              className="w-full flex-1 hover:bg-[var(--active-speaker)] flex justify-start items-center cursor-pointer transition-all duration-300 ease-in text-[var(--active-speaker)] rounded-tl-lg rounded-tr-lg text-[14px] py-1 px-2 hover:text-[var(--background-color)]"
                            >
                              <EditIcon style={{ fontSize: "16px" }} />
                              &nbsp;Edit
                            </div>
                            <div
                              onClick={() => handleDeleteMessage(item.msg_id)}
                              className=" w-full flex-1 hover:bg-red-100 flex justify-start items-center rounded-bl-lg rounded-br-lg cursor-pointer transition-all duration-300 ease-in hover:text-[var(--error-color)] text-[var(--error-color)] text-[14px] py-1 px-2"
                            >
                              <DeleteIcon style={{ fontSize: "16px" }} />
                              &nbsp;Delete
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div
                          className="max-w-[90%] bg-[var(--active-speaker)] px-4 py-2 rounded-tl-[20px] rounded-tr-[30px] rounded-br-[5px] rounded-bl-[20px] break-words"
                          key={index}
                        >
                          {item.replyTo?.user && item.replyTo?.data && (
                            <div className="bg-[var(--background-color)]/20 px-2 py-1 rounded mb-1 border-l-4 border-[var(--background-color)]">
                              <p className="text-[10px] font-bold text-[var(--background-color)]">
                                {item.replyTo.user}
                              </p>
                              <p className="text-[10px] text-[var(--background-color)] truncate">
                                {item.replyTo.data}
                              </p>
                            </div>
                          )}
                          <p className="text-[14px] text-[var(--light-primary)] font-extrabold truncate">
                            {item.sender}
                          </p>
                          <p className="text-[12px] text-[var(--light-primary)] font-medium">
                            {item.data}
                          </p>
                          <p className="text-[8px] text-[var(--light-primary)] text-right font-semibold">
                            {new Date(item.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        onContextMenu={(e) => {
                          e.preventDefault(); // remove default browser contextMenu
                          setContextMenu(item.msg_id);
                        }}
                        onTouchStart={() => handleTouchStart(item)}
                        onTouchEnd={handleTouchEnd}
                        className="w-full flex justify-start items-center gap-2 group"
                        key={item.msg_id}
                      >
                        <div className="max-w-[90%] bg-[var(--light-primary)] px-4 py-2 rounded-tl-[30px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[5px] break-words">
                          {item.replyTo?.user && item.replyTo?.data && (
                            <div className="bg-[var(--background-color)]/50 px-2 py-1 rounded mb-1 border-l-4 border-[var(--primary-color)]">
                              <p className="text-[10px] font-bold text-[var(--primary-color)]">
                                {item.replyTo.user}
                              </p>
                              <p className="text-[10px] text-[var(--primary-color)] truncate">
                                {item.replyTo.data}
                              </p>
                            </div>
                          )}
                          <p className="text-[14px] text-[var(--text-primary)] font-extrabold truncate">
                            {item.sender}
                          </p>
                          <p className="text-[12px] text-[var(--text-secondary)] font-medium">
                            {item.data}
                          </p>
                          <p className="text-[8px] text-[var(--text-secondary)] text-right font-semibold">
                            {new Date(item.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {contextMenu === item.msg_id ? (
                          <div className=" w-fit rounded-lg bg-[var(--light-primary)] flex flex-col justify-between items-center">
                            <div
                              onClick={() => handleReply(item.msg_id)}
                              className="w-full flex-1 hover:bg-[var(--active-speaker)] flex justify-start items-center rounded-tl-lg rounded-tr-lg cursor-pointer transition-all duration-300 ease-in text-[var(--active-speaker)] text-[14px] py-1 px-2 hover:text-[var(--background-color)]"
                            >
                              <ReplyIcon style={{ fontSize: "16px" }} />
                              &nbsp;Reply
                            </div>
                            <div
                              onClick={() => handleDeleteMessage(item.msg_id)}
                              className=" w-full flex-1 hover:bg-red-100 flex justify-start items-center rounded-bl-lg rounded-br-lg cursor-pointer transition-all duration-300 ease-in hover:text-[var(--error-color)] text-[var(--error-color)] text-[14px] py-1 px-2"
                            >
                              <DeleteIcon style={{ fontSize: "16px" }} />
                              &nbsp;Delete
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-[var(--light-primary)] text-[14px] font-medium w-fit m-auto px-4 py-2 rounded-lg">
                    No messages Yet.
                  </div>
                )}
                <div ref={messageEndRef}></div>
              </div>
              <div className={styles.chatInput}>
                <div className="flex-1 flex flex-col rounded-lg border border-l-4 border-[var(--primary-color)]">
                  {reply && (
                    <div className="flex-1 px-4 py-1 rounded-tl-lg rounded-tr-lg flex justify-between items-center">
                      <div>
                        <h1 className="text-[14px] font-bold text-[var(--text-primary)]">
                          {replyData.user}
                        </h1>
                        <p className="text-[12px] font-light text-[var(--text-secondary)] line-clamp-1">
                          {replyData.data}
                        </p>
                      </div>
                      <div
                        onClick={() => setReply(false)}
                        className="w-fit h-fit flex justify-center items-center text-[var(--error-color)] cursor-pointer hover:bg-red-100 p-1 border border-[var(--error-color)] rounded-full transition-all duration-300  ease-in"
                      >
                        <CloseIcon style={{ fontSize: "14px" }} />
                      </div>
                    </div>
                  )}
                  <input
                    placeholder="Messages . . ."
                    className="flex-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="h-full flex justify-center items-end">
                  {isEdit ? (
                    <IconButton
                      onClick={handleUpdatMessage}
                      style={{
                        backgroundColor: "var(--primary-hover)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <EditIcon
                        style={{ color: "var(--background-color)" }}
                      />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={sendMessage}
                      style={{
                        backgroundColor: "var(--primary-hover)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SendIcon
                        style={{ color: "var(--background-color)" }}
                      />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoMeetComponent;
