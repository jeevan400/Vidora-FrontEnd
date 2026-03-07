import React, { useEffect, useRef, useState } from 'react'
import "../styles/videoComponent.css"
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';

const server_url = import.meta.env.VITE_SERVER_URL;

let connections = {};

// STUN servers are lightweight servers running on the public internet which return the IP address of the requester's device
const peerConfigConnections = {
    "iceServers": [
        {"urls":"stun:stun.l.google.com:19302"}
    ]
}

function VideoMeetComponent() {

  let socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState();
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


  const getPermissions = async ()=>{
    try{

      // video permission
      const videoPermission = await navigator.mediaDevices.getUserMedia({video:true});

      if(videoPermission){
        setVideoAvailable(true);
      } else{
        setVideoAvailable(false);
      }

      // audio permission
      const audioPetmission = await navigator.mediaDevices.getUserMedia({audio: true});

      if(audioPetmission){
        setAudioAvailable(true);
      } else{
        setAudioAvailable(false);
      }

      // display media
      if(navigator.mediaDevices.getDisplayMedia){
        setScreenAvailable(true);
      } else{
        setScreenAvailable(false);
      }

      if(videoAvailable || audioAvailable){
        const userMediaStream = await navigator.mediaDevices.getUserMedia({video:videoAvailable, audio: audioAvailable});

        if(userMediaStream){
          window.localStream = userMediaStream;

          if(localVideoRef.current){
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch(e){
      console.log(e);
    }
  }

  useEffect(()=>{
    getPermissions();
  },[])

  // if any changes in the audio and video then it run means when audio and video on or off then it is run 
  let getUserMedia = ()=>{
    if((video && videoAvailable) || (audio && audioAvailable)){
      navigator.mediaDevices.getUserMedia({video: video, audio:audio})
      .then(()=>{})
      .then((stream)=>{})
      .catch((err)=> console.log(err));
    } else{
      try{
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      } catch(e){
        console.log(e);
      }
    }
  }

  useEffect(()=>{
    if(video !== undefined && audio !== undefined){
      getUserMedia();
    }
  },[audio, video]);

  let getMedia = ()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);

  }
  return (
    <div>
      {
        askForUsername === true ? 
        <div>
          
          <h1>Enter into Lobby</h1>
          {username}
          <TextField id="outlined-basic" label="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)} 
          variant="outlined" />

          <Button variant='contained'>Connect</Button>

          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>:<></>
      }
    </div>
  )
}

export default VideoMeetComponent;
