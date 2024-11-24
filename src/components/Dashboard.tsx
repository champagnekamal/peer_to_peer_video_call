// ts-ignore

import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket.ts";
import axios from "axios";
import GoogleTrends from "./GoogleTrends.tsx";
import Message from "./Message.tsx";
import Header from "./Header.tsx";
// import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  // const navigate:any = useNavigate()
  const [selectedOption, setSelectedOption]:any = useState(null);
  const [user, setUserDet]:any = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [receivedmessage, setReceivedMessage] = useState("");
  const [options, setoptions] = useState([]);
  // const [roomId, setroomId] = useState("");
  const [allUsers, setAllUsers] = useState<{ id: string; email: string }[]>([]);
  // const [fooEvents, setFooEvents]= useState([]);
// const[sendersocket,Setsendersocket] = useState("");
const [receiverSocket, setReceiverSocket] = useState("");

console.log(isConnected,"isConnected");

  
useEffect(()=>{
  (async function () {
    const d = await axios.get("https://peertopeervideocallserver-production.up.railway.app/getallusers");
    console.log(d,"rhjbr");
    setAllUsers(d?.data?.users);
  })();

  const user:any = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  setUserDet(parsedUser);


},[])

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // Free Google STUN server
  ],
};

const peerConnection = new RTCPeerConnection(configuration);

const startLocalVideo = async () => {
  try { 
    // Access the user's camera and microphone
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,  // Enable video
      audio: true,  // Enable audio
    });

    // Get the video element and set the stream
    const localVideo = document.getElementById("localVideo");
    if (localVideo) {
      (localVideo as HTMLVideoElement).srcObject = stream; // Assign the stream to the video element
    }
   
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
  } catch (error) {
    console.error("Error accessing user media:", error);
    // alert("Could not access camera or microphone. Please check your permissions.");
  }
};

peerConnection.onicecandidate = (event) => {
  console.log(event,"events");
  if (event.candidate) {
    socket.emit("ice-candidate", {
      to: receiverSocket, // Socket ID of the other peer
      candidate: event.candidate,
    });
  }
};

peerConnection.ontrack = (event) => {
  const remoteVideo = document.getElementById("remoteVideo");
  console.log(event.streams, "remoteVideo");

  if (remoteVideo && (remoteVideo as HTMLVideoElement).srcObject !== event.streams[0]) {
    (remoteVideo as HTMLVideoElement).srcObject = event.streams[0]; // Assign the stream to the video element

    remoteVideo.onloadedmetadata = () => {
      (remoteVideo as HTMLVideoElement)
        .play()
        .catch((error:any) => console.error("Error playing the video:", error));
    };
  }
};

useEffect(()=>{

  startLocalVideo();

  if(allUsers?.length > 0){
    let option:any = allUsers.map((e) => ({ value: e.id, label: e.email }));
    setoptions(option);
  console.log(options,"options");
  }
 
},[allUsers])


  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onlistenmessage(data:any) {
      console.log(data, "backend message");
      setReceivedMessage(data?.message);
    } 

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receivemessage", onlistenmessage);

    socket.on("incoming-call", (data) => {
      console.log("Incoming call from:", data);
  
      const accept = window.confirm(`${data.callerEmail} is calling. Accept?`);
  
      if (accept) {
        socket.emit("accept-call", { to: data.callerSocketId.socketid });
        setReceiverSocket(data.callerSocketId.socketid);
        startWebRTC(data.callerSocketId.socketid); // Start WebRTC handshake
      } else {  // Reject the call  
        socket.emit("reject-call", { to: data.callerSocketId.socketid });
      }
    });

    socket.on("call-accepted", () => {
      console.log("Call accepted! Starting WebRTC...");
      // Proceed with WebRTC setup
    });
  
    socket.on("call-rejected", () => {
      console.log("Call rejected.");
      alert("The user rejected your call.");
    });
  
    
  socket.on("webrtc-offer", async (data) => {
    try {
      console.log(data,"videocall")
      const remoteDesc = new RTCSessionDescription(data.offer);
      await peerConnection.setRemoteDescription(remoteDesc);
  
      // Create an SDP answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
  
      // Send the answer back to the caller
      socket.emit("webrtc-answer", {
        to: data.callerSocketId,
        answer,
      });
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  });

  socket.on("webrtc-answer", async (data) => {
    try {
      console.log(data,"webrtc-answer");
      const remoteDesc = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(remoteDesc);
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  });


  // Listen for incoming ICE candidates
  socket.on("ice-candidate", async (data) => {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  });


  return () => {
      socket.off("connect", onConnect);
      socket.off("receivemessage", onlistenmessage);
      socket.off("incoming-call");  
      socket.off("call-accepted");
      socket.off("call-rejected");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("ice-candidate");
      socket.off("disconnect", onDisconnect);
      // socket.off('foo', onFooEvent);
    };
  }, []);

  // const [det,setDet] = useState({})
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (socket) {
      let data = {
        message: message,
        email: selectedOption?.label,
      };
      socket.emit("message", data);
      setMessage(""); // Clear the input after sending
    }
  };


  const startcall = (d:any) => {
    console.log(user,"user");
    if (socket) {
      const data = {
        callerEmail: user.email, // Your logged-in user's email
        receiverEmail: d.label, // The selected user's email
      };
  
      socket.emit("call-request", data); // Emit the call request
      console.log("Call request sent:", data);
    }
  };
  
  const startWebRTC = async (receiverSocketId:any) => {
    try {
      // Create an SDP offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
  
      // Send the offer to the receiver through Socket.IO
      socket.emit("webrtc-offer", {
        to: receiverSocketId, // Receiver's socket ID
        offer,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  return (
    <>
    <Header user={user}/>
    <GoogleTrends/>
     <Message
     receivedmessage={receivedmessage} startcall={startcall}  selectedOption={selectedOption} setSelectedOption={setSelectedOption}
     options={options} message={message} setMessage={setMessage} sendMessage={sendMessage}
     />

<video id="localVideo" autoPlay muted style={{ width: "300px", border: "1px solid black" }}></video>
<video id="remoteVideo" autoPlay></video>
    </>
  );
};

export default Dashboard;
