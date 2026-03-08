import React, { useEffect, useRef, useState } from "react";
import "../styles/videoComponent.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";
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
  let [showModal, setShowModal] = useState();
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

  let getUserMediaSuccess = (stream) => {};

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
  let gotMesssageFromServer = (fromId, message) => {};

  // Function that will add chat messages to the chat UI
  // This runs whenever a chat message event is received
  let addMessage = () => {};

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
        setVideo((videos) => videos.filter((video) => video.socketId !== id));
      });

      // Event triggered when a new user joins the meeting
      socketRef.current.on("user-joined", (id, clients) => {
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
              setVideo((videos) => {
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
              setVideo((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };
        });
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
  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h1>Enter into Lobby</h1>
          {username}
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />

          <Button variant="contained" onClick={connect}>
            Connect
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default VideoMeetComponent;
