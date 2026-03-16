import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/videoComponent.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamoffIcon from "@mui/icons-material/Videocamoff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import vIcon from "../assets/vidoraImages/V_icon.png";
import SendIcon from "@mui/icons-material/Send";

const server_url = import.meta.env.VITE_SERVER_URL;

let connections = {};

// STUN servers are lightweight servers running on the public internet which return the IP address of the requester's device
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoMeetComponent() {
  let socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

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

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

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
        console.log("this is my server url ", server_url);
      } else {
        setAudioAvailable(false);
      }

      // display media
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
        console.log(description);
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

          // TODO BlackSilence
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

  // if any changes in the audio and video then it run means when audio and video on or off then it is run
  // Function to start or stop user media ( camera / micraophone)
  let getUserMedia = () => {
    // if the user wants video or audio AND the device supports it then start media stream
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio }) // Request camera and microphone permission from the browser
        .then(getUserMediaSuccess) // Promise resolved when user allows permission
        .then((stream) => {})
        .catch((err) => console.log(err)); // Handle errors like permission denied or device not found
    } else {
      // if the user turns camera or mic OFF. stop all tracks from the current media stream
      try {
        let tracks = localVideoRef.current.srcObject.getTracks(); // get all media tracks (video + audio)
        tracks.forEach((track) => track.stop()); // stop each track
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
  // These messages are used to establish webRTC connections (offer, answers, ICE candidates)
  // This function is called whenever we receive a signaling message
  // from the socket server (offer / answer/ ICE candidate)
  let gotMesssageFromServer = (fromId, message) => {
    // Conver the incoming string message into a javaScript object
    let signal = JSON.parse(message);

    // Ignore messages that come from our own socket
    if (fromId !== socketIdRef.current) {
      // If the message contains SDP (offer or answer)
      if (signal.sdp) {
        // Set the received SDP as the remote description
        // This tells our peer connection what the other peer supports
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            // If the received SDP type is "offer" then we need to generate an answer
            if (signal.sdp.type === "offer") {
              // create an SDP answer
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  // set the genrated answer as the local description
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      // Send the answer back to the remote peer through the socket signaling server
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
        // Add the ICE candidate to the peer connection
        // This helps in finding the best network route
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  // Function that will add chat messages to the chat UI
  // This runs whenever a chat message event is received
  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevMessages) => prevMessages + 1);
    }
  };

  // Function used to connect the client to the socket signaling server
  let connectToSocketServer = () => {
    // Cstablish socket.io connection with the server
    socketRef.current = io.connect(server_url, { secure: false });

    //Listen for signaling events from the server
    // These signals contain WebRTC connection data
    socketRef.current.on("signal", gotMesssageFromServer);

    // This runs when the socket connection is successfully established
    socketRef.current.on("connect", () => {
      //Inform the server that this user wants to join a call room
      // window.location.href is being used as the meeting room ID
      socketRef.current.emit("join-call", window.location.href);

      // Store the current user's socket ID
      socketIdRef.current = socketRef.current.id;

      // Listen for incoming chat messages from other users
      socketRef.current.on("chat-message", addMessage);

      // Event triggered when a user leaves the meeting
      socketRef.current.on("user-left", (id) => {
        // Remove that user's video from the video list
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      // Event triggered when a new user joins the meeting
      socketRef.current.on("user-joined", (id, clients) => {
        console.log("USER JOINED EVENT");
        console.log("ID:", id);
        console.log("CLIENTS:", clients);
        // Create a new WebRTC peer connection for that user
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          // Handle ICE candidate generation
          // ICE candidates help find the best network path between users
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              // Send the ICE candidate to the other user through the socket server
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          // Event triggered when a remote user stream is received
          connections[socketListId].onaddstream = (event) => {
            // Check if this user's video already exists in the UI
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            // if the video already exists
            if (videoExists) {
              // Update the existing video stream
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video,
                );
                // update refrence array
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // If the video does not exist yet, create a new video object
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
            //Add local media stram to the peer connection
            // This allows sending out camera/mic stram to the remote user
            connections[socketListId].addStream(window.localStream);
          } else {
            //Black silence
            // if no media stram is available
            // we will send an empty (black/silent) stream

            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        // check if the current socket id belongs to this user
        if (id === socketIdRef.current) {
          // Loop through all existing peer connections
          for (let id2 in connections) {
            // Skip if the connection belongs to the current user
            if (id2 === socketIdRef.current) continue;

            try {
              // Add local stream to the peer connection
              // so the remote user can receive our video/ audio
              connections[id2].addStream(window.localStream);
            } catch (e) {
              // log any error that occurs while adding stream
              console.log(e);
            }

            // Create webRTC offer for starting the connection
            connections[id2].createOffer().then((description) => {
              // Set the created offer as the local description
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  // Send the offer (SDP) to the remote peer through socket server
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                // Catch any error while setting local description
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  // Function used to enable camera and microphone
  let getMedia = () => {
    // Set Video state depending on whether camera is available
    setVideo(videoAvailable);
    // Set audio state depending on whether microphone is available
    setAudio(audioAvailable);
  };

  // Function that runs when the user clicks the "Connect" button
  let connect = () => {
    // Hide the username input screen
    setAskForUsername(false);
    // Enable camera and microphone
    getMedia();
    //Connect to the socket signalin server
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
  };

  let sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };
  return (
    <div>
      {askForUsername === true ? (
        <div className={styles.lobbyContainer}>
          <div className={styles.lobbyForm}>
            <div className={styles.formContent}>
              <div className={styles.logoImage}>
                <h1>Welcome to</h1>
                <div className="flex justify-center items-center">
                  <img src={vIcon} alt="logo" />
                  <h1>idora</h1>
                </div>
              </div>
              <TextField
                className={styles.formTextField}
                id="filled-basic"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="filled"
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "var(--primary-color)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "1px solid var(--primary-color)",
                  },
                }}
              />
              <div className={styles.formMainContent}>
                <h2>Enter the Meeting Room</h2>
                <p>
                  Join the meeting and start seamless communication in seconds.
                </p>
              </div>
            </div>
            <Button
              className={styles.lobbyFormButton}
              variant="contained"
              onClick={connect}
            >
              Connect
            </Button>
          </div>

          <div className={styles.lobbyStream}>
            <video ref={localVideoRef} autoPlay muted></video>
            <div className="w-[97%] h-[90%] absolute top-4 left-4 flex flex-col justify-start gap-2">
              <div className="bg-[#4f46e54d] w-fit px-4 py-2 rounded-lg border border-indigo-500 shadow-[0_0_20px_#4f46e56d] text-white font-light  ">
                <h1 className="text-[16px] font-bold">Audio</h1>
                <p className="text-[12px] font-light">
                  Clear and smooth voice communication.
                </p>
              </div>
              <div className="bg-[#4f46e54d] w-fit px-4 py-2 rounded-lg border border-indigo-500 shadow-[0_0_20px_#4f46e56d] text-white font-light ">
                <h1 className="text-[16px] font-bold">Video</h1>
                <p className="text-[12px] font-light">
                  Connect face-to-face with live video.
                </p>
              </div>
              <div className="absolute top-4 right-6">
                <img
                  className="h-8 w-8 rounded-full border border-indigo-500"
                  src={vIcon}
                  alt="logo"
                />
              </div>
              <div className="w-fit px-4 py-2 bg-[#4f46e54d] rounded-lg text-white  border border-indigo-500 shadow-[0_0_20px_#4f46e56d]">
                <h1 className="text-[16px] font-bold">Chat</h1>
                <p className="text-[12px] font-light">
                  Send quick messages during the meeting
                </p>
              </div>
              <div className="w-fit px-4 py-2 bg-[#4f46e54d] rounded-lg text-white border border-indigo-500 shadow-[0_0_20px_#4f46e56d]">
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
          {/* {styles.conferenceView} */}
          <div className={styles.conferenceView}>
            {videos.map((video) => (
              <video
                // {styles.conferenceUsers}
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
            <div className="bg-white/20 px-6 py-2 rounded-full border border-[var(--border-color)] shadow-lg flex justify-between items-center gap-4">
              <IconButton onClick={handleVideo}>
                {video === true ? (
                  <VideocamIcon style={{ color: "var(--primary-hover)" }} />
                ) : (
                  <VideocamoffIcon />
                )}
              </IconButton>
              <IconButton>
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
              <h1 className="flex justify-center items-center bg-white w-fit px-4 py-1 rounded-full">
                <img className="h-8 w-8 rounded-full" src={vIcon} alt="logo" />
                <span className="text-[18px] text-[#060606] font-bold">
                  idora Chat
                </span>
              </h1>
              <div className={styles.chatBox}>
                {messages.length > 0 ? (
                  messages.map((item, index) => {
                    return (
                      <div className="w-fit bg-[var(--primary-color)] px-4 py-2 rounded-tl-[30px] rounded-tr-[30px] rounded-br-[30px] rounded-bl-[10px]" key={index}>
                        <p className="text-[16px] text-[#ffffff] font-extrabold ">{item.sender}</p>
                        <p className="text-[14px] text-[#ffffff] font-medium">{item.data}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="">No messages Yet.</div>
                )}
              </div>
              <div className={styles.chatInput}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                />
                <IconButton
                  onClick={sendMessage}
                  style={{
                    backgroundColor: "var(--primary-hover)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SendIcon style={{ color: "white" }} />
                </IconButton>
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
