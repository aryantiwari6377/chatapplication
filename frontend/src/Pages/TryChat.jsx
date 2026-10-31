
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
import EmojiPicker from 'emoji-picker-react';
import { uploadFileToS3 } from '../Services/user/uploadFile';

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
const [showEmojiPicker, setShowEmojiPicker] = useState(false);

const fileInputRef = useRef(null);
const senderIdRef = useRef('');
const [uploadProgress, setUploadProgress] = useState(null);
const [stagedFile, setStagedFile] = useState(null);

// ── Camera state ─────────────────────────────────────────────────────────────
const [showCamera, setShowCamera] = useState(false);
const cameraVideoRef = useRef(null);
const cameraStreamRef = useRef(null);

// ── Audio recording state ────────────────────────────────────────────────────
const [isRecording, setIsRecording] = useState(false);
const mediaRecorderRef = useRef(null);
const audioChunksRef = useRef([]);


  const userToken = sessionStorage.getItem('token');

  useEffect(() => {
    
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        query: { token: userToken },
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
      });

      // socketRef.current.on('receiveMessage', (message) => {
      //   console.log("listen receive",message);
      //   setMessages((prevMessages) => [...prevMessages, message]);
      //   console.log("newMessage",newMessage);
      //   setNewMessage("");

      // });
      socketRef.current.on('receiveMessage', (message) => {
  const messageSenderId = message.senderId ?? message.sender;
  // Use the ref so we always have the latest senderid even though
  // this closure was created before senderid was populated.
  const isOwnMessage = String(messageSenderId) === String(senderIdRef.current);

  // Text messages: sender added them optimistically — skip the socket echo.
  // File/image/audio messages: no optimistic add was done — show socket response for everyone.
  if (isOwnMessage && (message.messageType === 'text' || !message.messageType)) return;

  setMessages((prevMessages) => [...prevMessages, message]);
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
  
  useEffect(() => {
  senderIdRef.current = senderid;
}, [senderid]);


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

  const sendMessage = async () => {
    // ── Send staged file if one is waiting ──────────────────────────────────
    if (stagedFile) {
      try {
        setUploadProgress(0);

        const { publicUrl, fileType, fileName } = await uploadFileToS3(stagedFile.file, (pct) => {
          setUploadProgress(pct);
        });

        setUploadProgress(null);
        setStagedFile(null);

        const msgType = fileType.startsWith('image/') ? 'image'
                      : fileType.startsWith('audio/') ? 'audio'
                      : 'file';

        socketRef.current.emit('sendMessage', {
          senderId: senderid,
          receiverId: id,
          messageText: '',
          fileUrl: publicUrl,
          fileType,
          fileName,
          messageType: msgType,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        setUploadProgress(null);
        console.error('File upload failed:', err);
        alert(err?.response?.data?.message || 'File upload failed. Please try again.');
      }
      return;
    }

    // ── Send plain text ──────────────────────────────────────────────────────
    if (!newMessage.trim()) return;
    const messageData = {
      receiverId: id,
      messageText: newMessage,
      senderId: senderid,
      timestamp: new Date().toISOString(),
    };
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












// ── Camera handlers ───────────────────────────────────────────────────────────
  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Camera is not supported on this connection.\nMake sure you are on localhost or HTTPS.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (cameraVideoRef.current) cameraVideoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error('Camera error:', err.name, err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert(
          'Camera permission was denied.\n\n' +
          'To fix this in Chrome:\n' +
          '1. Click the 🔒 or ℹ️ icon in the address bar\n' +
          '2. Set Camera → Allow\n' +
          '3. Refresh the page and try again.'
        );
      } else if (err.name === 'NotFoundError') {
        alert('No camera device found on this machine.');
      } else {
        alert(`Camera error: ${err.message}`);
      }
    }
  };

  const capturePhoto = () => {
    const video = cameraVideoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      setStagedFile({ file, previewUrl, name: file.name });
      closeCamera();
    }, 'image/jpeg', 0.92);
  };

  const closeCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    setShowCamera(false);
  };

  // ── Audio handlers ────────────────────────────────────────────────────────────
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Microphone is not supported on this connection.\nMake sure you are on localhost or HTTPS.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const file = new File([blob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
          setStagedFile({ file, previewUrl: null, name: file.name, isAudio: true });
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Microphone error:', err.name, err.message);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          alert(
            'Microphone permission was denied.\n\n' +
            'To fix this in Chrome:\n' +
            '1. Click the 🔒 or ℹ️ icon in the address bar\n' +
            '2. Set Microphone → Allow\n' +
            '3. Refresh the page and try again.'
          );
        } else if (err.name === 'NotFoundError') {
          alert('No microphone device found on this machine.');
        } else {
          alert(`Microphone error: ${err.message}`);
        }
      }
    }
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
        <FontAwesomeIcon icon={faArrowLeft} className="text-[rgba(192,52,48,255)] text-xl mt-2 cursor-pointer" />
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
        <FontAwesomeIcon icon={faPhone} className="text-[rgba(192,52,48,255)] text-xl mt-2 cursor-pointer"  onClick={startCall}/>
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
            <div
              className={`text-sm flex flex-col ${
                String(message.senderId ?? message.sender) === String(senderid)
                  ? 'items-end'
                  : 'items-start'
              }`}
            >
              {/* ── Image attachment ─────────────────────────────────── */}
              {message.messageType === 'image' && message.fileUrl && (
                <a href={message.fileUrl} target="_blank" rel="noreferrer">
                  <img
                    src={message.fileUrl}
                    alt={message.fileName || 'attachment'}
                    className="max-w-[220px] max-h-[220px] rounded-lg object-cover border border-gray-600 cursor-pointer"
                  />
                </a>
              )}

              {/* ── Generic file (PDF, DOCX, TXT …) ─────────────────── */}
              {message.messageType === 'file' && message.fileUrl && (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition ${
                    String(message.senderId ?? message.sender) === String(senderid)
                      ? 'bg-[rgba(56,59,68,255)] text-white hover:bg-[rgba(80,84,96,255)]'
                      : 'bg-[rgba(56,59,68,255)] text-yellow-500 hover:bg-[rgba(80,84,96,255)]'
                  }`}
                >
                  <span>📎</span>
                  <span className="underline truncate max-w-[180px]">
                    {message.fileName || 'Download file'}
                  </span>
                </a>
              )}

              {/* ── Voice message ─────────────────────────────────────── */}
              {message.messageType === 'audio' && message.fileUrl && (
                <div className={`flex flex-col gap-1 px-3 py-2 rounded-lg text-xs ${
                  String(message.senderId ?? message.sender) === String(senderid)
                    ? 'bg-[rgba(56,59,68,255)] text-white'
                    : 'bg-[rgba(56,59,68,255)] text-yellow-500'
                }`}>
                  <span className="mb-1">🎤 Voice message</span>
                  <audio controls src={message.fileUrl} className="h-8 w-48" />
                </div>
              )}

              {/* ── Plain text ───────────────────────────────────────── */}
              {(message.messageType === 'text' || !message.messageType) && (
                <span
                  className={
                    String(message.senderId ?? message.sender) === String(senderid)
                      ? 'text-white'
                      : 'text-yellow-500'
                  }
                >
                  {message.content || message.messageText}
                </span>
              )}

              <span className="text-xs text-gray-400 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </li>
        );
      })}
    </li>
  ))}
</ul>

    </div>

    {/* Input Section */}
    <div className="bg-[rgba(41,45,54,255)] w-full py-2 px-2 md:px-4 flex flex-col gap-1">

      {/* Staged file preview — shown after picking a file, before hitting send */}
      {stagedFile && (
        <div className="flex items-center gap-2 bg-[rgba(56,59,68,255)] rounded-lg px-3 py-2 mb-1">
          {stagedFile.previewUrl ? (
            <img
              src={stagedFile.previewUrl}
              alt="preview"
              className="w-10 h-10 rounded object-cover border border-gray-500"
            />
          ) : stagedFile.isAudio ? (
            <span className="text-lg">🎤</span>
          ) : (
            <span className="text-lg">📎</span>
          )}
          <span className="text-xs text-yellow-400 truncate flex-1">{stagedFile.name}</span>
          <button
            onClick={() => {
              if (stagedFile.previewUrl) URL.revokeObjectURL(stagedFile.previewUrl);
              setStagedFile(null);
            }}
            className="text-gray-400 hover:text-white text-sm leading-none"
            aria-label="Remove attachment"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload progress bar — visible while uploading */}
      {uploadProgress !== null && (
        <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c03430] transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
      {/* <FontAwesomeIcon icon={faFaceSmile} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" /> */}
      <div className="relative">
  <FontAwesomeIcon
    icon={faFaceSmile}
    className="text-[#c03430] cursor-pointer text-xl"
    onClick={() => setShowEmojiPicker(prev => !prev)}
  />

  {showEmojiPicker && (
    <div className="absolute bottom-12 left-0 z-50">
      <EmojiPicker
        onEmojiClick={(emojiData) => {
          setNewMessage(prev => prev + emojiData.emoji);
          setShowEmojiPicker(false);
        }}
        height={350}
        width={300}
        previewConfig={{ showPreview: false }}
      />
    </div>
  )}
</div>
      <input
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={handleTyping}
        className="bg-transparent outline-none text-white placeholder-gray-400 flex-1"
      />
      {/* <FontAwesomeIcon icon={faPaperclip} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl"  /> */}
      <FontAwesomeIcon
  icon={faPaperclip}
  className="text-[#c03430] cursor-pointer text-xl"
  onClick={() => fileInputRef.current?.click()}
/>
{/* Hidden file input — only stages the file, send happens on the send button */}
<input
  ref={fileInputRef}
  type="file"
  hidden
  accept="image/*,.pdf,.doc,.docx,.txt"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset so same file can be re-picked

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setStagedFile({ file, previewUrl, name: file.name });
  }}
/>
      <FontAwesomeIcon icon={faCamera} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" onClick={openCamera} />
      <div
        className={`h-8 w-8 flex items-center justify-center cursor-pointer rounded-full transition ${
          isRecording ? 'bg-red-600 animate-pulse' : 'bg-[rgba(192,52,48,255)]'
        }`}
        onClick={toggleRecording}
        title={isRecording ? 'Stop recording' : 'Record voice message'}
      >
        <FontAwesomeIcon icon={faMicrophone} className="text-xl" />
      </div>
      {/* <button
        className="bg-purple-800 text-white font-bold px-4 py-1 rounded-full text-[14px]"
        onClick={sendMessage}
      >
        Send
      </button> */}
      <img src={s2} className='w-[30px] h-[30px] rounded-full cursor-pointer' onClick={sendMessage}/>
    </div>{/* end flex items-center */}
    </div>{/* end Input Section */}
  </div>


{showCamera && (
  <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-4">
    <video
      ref={cameraVideoRef}
      autoPlay
      playsInline
      muted
      className="w-full max-w-sm rounded-xl border border-gray-600"
    />
    <div className="flex gap-6">
      <button
        onClick={capturePhoto}
        className="bg-white text-black font-bold px-6 py-2 rounded-full text-sm"
      >
        📸 Capture
      </button>
      <button
        onClick={closeCamera}
        className="bg-[rgba(192,52,48,255)] text-white font-bold px-6 py-2 rounded-full text-sm"
      >
        ✕ Cancel
      </button>
    </div>
  </div>
)}
</div>

  );
};

export default TryChat;



