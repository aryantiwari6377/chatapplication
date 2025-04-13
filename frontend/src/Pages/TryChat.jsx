
import { faArrowLeft, faCamera, faMicrophone, faPaperclip, faPhone,faPhoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import profile from "../images/profile.jpg";
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatUserDetails } from '../../src/Services/user/chatuserdetail';
import { io } from 'socket.io-client';
import { allmessageservice } from '../Services/user/allmessages';
import perfect from '../images/perfect.png';
import SimplePeer from 'simple-peer';
import process from 'process';
import s1 from '../images/send4.png';
import s2 from '../images/send1.jpeg';
window.process = process;


const TryChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderid, setsenderid] = useState('');
  const [userStatus, setUserStatus] = useState({});
  const [typeStatus, setTypeStatus] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const lastMessageRef = useRef(null);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null); 

  //new
  const [call, setCall] = useState(null);
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const myVideo = useRef(null);
  const userVideo = useRef(null);




  const userToken = sessionStorage.getItem('token');

  useEffect(() => {
    
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        query: { token: userToken },
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
      });

      socketRef.current.on('receiveMessage', (message) => {
        console.log("listen receive",message);
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log("newMessage",newMessage);
        setNewMessage("");

      });

      socketRef.current.on('onlineUsers', (users) => {
        setOnlineUsers(new Set(users));
      });

      socketRef.current.on('displayTyping', ({ senderid, isTyping }) => {
        if (senderid === id) {
          setTypeStatus(isTyping);
        }
      });




      
      socketRef.current.on('incomingCall', ({ from, signalData }) => {
        setCall({ isReceivingCall: true, from, signalData });
    });

    socketRef.current.on('callAccepted', (signal) => {
        peerConnection.signal(signal);
        setCallAccepted(true);
    });

    socketRef.current.on('callRejected', () => {
        setCall(null);
    });

    socketRef.current.on('callEnded', () => {
        endCall();
    });
    }

    return () => {
     
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userToken, id]);

  const userdetail = async () => {
    try {
      const res = await getChatUserDetails(id);
      console.log("user detail done");
      if(res.status === 401){
        navigate("/login");
      }
      if (res) {
        setsenderid(res.senderId);
        setUser(res.user);
        
      }
    } catch(error) { 
      console.error("Error fetching user details:", error);
    }
  };

  const allmessages = async () => {
    try {
      const response = await allmessageservice(id, senderid);
      console.log("message call done");
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("the latest message",newMessage);
    const messageData = { receiverId: id, messageText: newMessage, senderId: senderid,   timestamp: new Date().toISOString()};
    setMessages((prevMessages) => [...prevMessages, messageData]);
    socketRef.current.emit('sendMessage', messageData);
    setNewMessage('');
  };


 
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socketRef.current.emit('typing', { senderid, receiverId: id, isTyping: true });
 
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current.emit('typing', { senderid, receiverId: id, isTyping: false });
    }, 2000);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await userdetail();
      await allmessages();
    };
    fetchInitialData();
  }, [id, senderid]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
  }, [messages]);
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = '';
    messages.forEach((message) => {
      const messageDate = formatTimestamp(message.timestamp);
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        grouped.push({ date: currentDate, messages: [message] });
      } else {
        grouped[grouped.length - 1].messages.push(message);
      }
    });
    return grouped;
  };
             
  const groupedMessages = groupMessagesByDate(messages);

  const Back = () => navigate(-1);



  

  //new
 
  const startCall = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
        if (myVideo.current) myVideo.current.srcObject = stream;

        const peer = new SimplePeer({ initiator: true, trickle: false, stream });

        peer.on('signal', (signalData) => {
            socketRef.current.emit('callUser', { receiverId: id, signalData, from: userToken });
        });

        peer.on('stream', (userStream) => {
            if (userVideo.current) userVideo.current.srcObject = userStream;
        });

        setPeerConnection(peer);
    } catch (error) {
        console.error("Error starting call:", error);
    }
};

const answerCall = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
        if (myVideo.current) myVideo.current.srcObject = stream;

        const peer = new SimplePeer({ initiator: false, trickle: false, stream });

        peer.on('signal', (signal) => {
            socketRef.current.emit('answerCall', { to: call.from, signal });
        });

        peer.on('stream', (userStream) => {
            if (userVideo.current) userVideo.current.srcObject = userStream;
        });

        peer.signal(call.signalData);
        setCallAccepted(true);
        setPeerConnection(peer);
    } catch (error) {
        console.error("Error answering call:", error);
    }
};

const rejectCall = () => {
    socketRef.current.emit('rejectCall', { to: call.from });
    setCall(null);
};

const endCall = () => {
    if (peerConnection) {
        peerConnection.destroy();
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    socketRef.current.emit('endCall', { to: id });
    setCall(null);
    setCallAccepted(false);
    setCallEnded(true);
    setPeerConnection(null);
};












  return (
   
  <div className="bg-[rgba(27,32,38,255)] min-h-screen text-white md:flex">
  {/* Left Section */}
  <div className="hidden md:block md:w-[50%] lg:w-[60%]">
    <img
      src={perfect}
      alt="Chat Illustration"
      className="md:pt-[16%] lg:w-[70%] lg:pt-[8%] lg:pl-[22%]"
    />
    <h2 className="hidden md:block text-md px-3 font-bold lg:text-xl lg:w-[60%] lg:mx-auto">
      Chat with your besties! 💬✨
    </h2>
  </div>

  {/* Right Section */}
  <div className="md:w-[50%] lg:w-[40%] flex flex-col h-screen">
    {/* Header */}
    <div className="bg-[rgba(56,59,68,255)] flex justify-between px-3 py-2">
      <div className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]" onClick={Back}>
        <FontAwesomeIcon icon={faArrowLeft} className="text-[rgba(192,52,48,255)] text-xl mt-2" />
      </div>

      <div className="flex gap-x-3 px-3 rounded-full bg-[rgba(41,45,54,255)] text-white">
        <img src={profile} alt="Profile" className="w-10 h-10 rounded-full" />
        <div className="text-start">
          <p>{user?.username}</p>
          <p>{onlineUsers.has(id) ? '🟢 Online' : '⚫ Offline'}</p>
          <p>{typeStatus ? 'Typing...' : ''}</p>
        </div>
      </div>

      <div className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]">
        <FontAwesomeIcon icon={faPhone} className="text-[rgba(192,52,48,255)] text-xl mt-2"  onClick={startCall}/>
      </div>
    </div>

   {/* call */}
   {call?.isReceivingCall && !callAccepted && (
                <div className="incoming-call">
                    <p>Incoming call...</p>
                    <button onClick={answerCall}>Accept</button>
                    <button onClick={rejectCall}>Reject</button>
                </div>
            )}

            {callAccepted && !callEnded && (
                <div className="video-call">
                    <video ref={myVideo} autoPlay playsInline />
                    <video ref={userVideo} autoPlay playsInline />
                    <FontAwesomeIcon icon={faPhoneSlash} className="end-call" onClick={endCall} />
                </div>
            )}




    {/* Message List */}  
    <div   
      className="flex-1 overflow-y-auto pb-[30px]"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >  
      {/* <ul>  
        {groupedMessages.map((group, index) => (
          <div key={index}>
            <p className="text-xs text-white mx-3 mt-4">{group.date}</p>
     
            {group.messages.map((message, idx) => (
               
           
              <li key={idx} className="mx-3 mt-4 rounded-md"  >
                <p
                  className={`text-sm ${
                    message.sender === senderid
                      ? 'self-end text-right'  
                      : 'self-start text-yellow-500 text-left'
                  }`}
                > 
                  {message.content}  {message.messageText}
                  <span className="ml-2 text-xs text-white">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
              </li>
            ))}
          </div>
        ))}
      </ul> */}
      <ul>  
  {groupedMessages.map((group, index) => (
    <li key={index} className="list-none">
      <p className="text-xs text-white mx-3 mt-4">{group.date}</p>

      {group.messages.map((message, idx) => {
        const isLastMessage =
          index === groupedMessages.length - 1 && idx === group.messages.length - 1;

        return (
          <li key={idx} className="mx-3 mt-4 rounded-md" ref={isLastMessage ? lastMessageRef : null}>
            <p
              className={`text-sm ${
                message.sender === senderid
                  ? 'self-end text-right'  
                  : 'self-start text-yellow-500 text-left'
              }`}
            >  
              {message.content} {message.messageText}
              <span className="ml-2 text-xs text-white">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </p>
          </li>
        );
      })}
    </li>
  ))}
</ul>

    </div>

    {/* Input Section */}
    <div className="bg-[rgba(41,45,54,255)] w-full py-2 px-2 md:px-4 flex items-center gap-3">
      <FontAwesomeIcon icon={faFaceSmile} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" />
      <input
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={handleTyping}
        className="bg-transparent outline-none text-white placeholder-gray-400 flex-1"
      />
      <FontAwesomeIcon icon={faPaperclip} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" onClick={sendMessage} />
      <FontAwesomeIcon icon={faCamera} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" onClick={sendMessage} />
      <div className="bg-[rgba(192,52,48,255)] h-8 w-8 flex items-center justify-center rounded-full">
        <FontAwesomeIcon icon={faMicrophone} className="text-xl" onClick={sendMessage} />
      </div>
      {/* <button
        className="bg-purple-800 text-white font-bold px-4 py-1 rounded-full text-[14px]"
        onClick={sendMessage}
      >
        Send
      </button> */}
      <img src={s2} className='w-[30px] h-[30px] rounded-full'/>
    </div>
  </div>
</div>


  );
};

export default TryChat;



