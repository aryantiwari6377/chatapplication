
import { faArrowLeft, faCamera, faMicrophone, faPaperclip, faPhone, faPhoneSlash, faReply, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import { friendlistservice } from '../Services/user/friendlist';

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
  const [callStatus, setCallStatus] = useState(null); // null | 'ringing' | 'connected' | 'ended'
  const [peerConnection, setPeerConnection] = useState(null);
  const peerRef = useRef(null);
  const isEndingCall = useRef(false);
  const callStartTime = useRef(null);   // track when call connected for duration
  const myVideo = useRef(null);
  const userVideo = useRef(null);

  // Call history — persisted in localStorage per chat pair
  const historyKey = senderid && id ? `callHistory_${senderid}_${id}` : null;
  const [callHistory, setCallHistory] = useState(() => {
    try {
      const key = `callHistory_${sessionStorage.getItem('senderId') || ''}_${window.location.pathname.split('/').pop()}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  // unread count — only missed/rejected INCOMING calls the user hasn't opened yet
  const [unreadCallCount, setUnreadCallCount] = useState(0);

  const addCallHistory = (entry) => {
    setCallHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      if (historyKey) localStorage.setItem(historyKey, JSON.stringify(updated));
      // bump unread only for incoming missed/rejected — the receiver didn't initiate
      if (entry.type === 'incoming' && (entry.status === 'missed' || entry.status === 'rejected')) {
        setUnreadCallCount(c => c + 1);
      }
      return updated;
    });
  };

  const openHistory = () => {
    setShowHistory(true);
    setUnreadCallCount(0); // clear badge when user opens the drawer
  };
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

// Call events shown inline in the message list (like WhatsApp)
const [callEvents, setCallEvents] = useState([]);
   
const formatDuration = (secs) => {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const pushCallEvent = (entry) => {
  setCallEvents(prev => [...prev, { ...entry, _isCallEvent: true, _id: Date.now() }]);
};

// ── Reply state ───────────────────────────────────────────────────────────────
const [replyTo, setReplyTo] = useState(null); // { _id, content, messageType, fileName, fileUrl, senderName }
const inputRef = useRef(null); // focus input after selecting reply

// ── Forward state ─────────────────────────────────────────────────────────────
const [forwardMsg, setForwardMsg]     = useState(null);  // message being forwarded
const [friendsList, setFriendsList]   = useState([]);    // loaded on demand
const [showForward, setShowForward]   = useState(false);
const [forwardSearch, setForwardSearch] = useState('');

// ── Call sound ───────────────────────────────────────────────────────────────
const audioCtxRef      = useRef(null);
const ringIntervalRef  = useRef(null);

const getAudioCtx = () => {
  if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtxRef.current;
};

// Play a single tone burst: freq Hz, duration ms, gap ms
const playTone = (freq, dur, vol = 0.3) => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur / 1000);
  } catch {}
};

// Outgoing ringback: "du-du ... du-du" pattern every 4 s
const startRingback = () => {
  stopRingSound();
  const ring = () => { playTone(425, 400); setTimeout(() => playTone(425, 400), 500); };
  ring();
  ringIntervalRef.current = setInterval(ring, 4000);
};

// Incoming ringtone: higher, more urgent, every 2 s
const startIncomingRing = () => {
  stopRingSound();
  const ring = () => {
    playTone(880, 200); setTimeout(() => playTone(1100, 200), 250); setTimeout(() => playTone(880, 200), 500);
  };
  ring();
  ringIntervalRef.current = setInterval(ring, 2000);
};

const stopRingSound = () => {
  if (ringIntervalRef.current) { clearInterval(ringIntervalRef.current); ringIntervalRef.current = null; }
};


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
        startIncomingRing(); // receiver hears ringtone
      });

      socketRef.current.on('callAccepted', (signal) => {
        if (peerRef.current) peerRef.current.signal(signal);
        setCallAccepted(true);
        setCallStatus('connected');
        callStartTime.current = Date.now();
        stopRingSound(); // caller's ringback stops when other side picks up
      });

      socketRef.current.on('callRejected', () => {
        stopRingSound();
        const entry = {
          type: 'outgoing',
          status: 'rejected',
          with: user?.username || id,
          time: new Date().toISOString(),
          duration: null,
        };
        addCallHistory(entry);
        pushCallEvent(entry);
        setCallStatus(null);
        setCall(null);
        cleanupCall(false);
      });

      socketRef.current.on('callEnded', () => {
        if (isEndingCall.current) return;
        isEndingCall.current = true;
        stopRingSound();
        const dur = callStartTime.current ? Math.round((Date.now() - callStartTime.current) / 1000) : 0;
        const entry = {
          type: 'incoming',
          status: 'ended',
          with: user?.username || id,
          time: new Date().toISOString(),
          duration: dur,
        };
        addCallHistory(entry);
        pushCallEvent(entry);
        cleanupCall(false);
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
  // reload call history now that we know senderid
  if (senderid && id) {
    try {
      const key = `callHistory_${senderid}_${id}`;
      setCallHistory(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch { setCallHistory([]); }
  }
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
          ...(replyTo ? { replyTo } : {}),
        });
        setReplyTo(null);
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
      ...(replyTo ? { replyTo } : {}),
    };
    setMessages((prevMessages) => [...prevMessages, messageData]);
    socketRef.current.emit('sendMessage', messageData);
    setNewMessage('');
    setReplyTo(null); // clear reply after sending
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



  

  // ── Shared call cleanup ───────────────────────────────────────────────────
  // emitEnd: true = we are the one ending (emit socket), false = we received the end event
  const cleanupCall = (emitEnd = false) => {
    stopRingSound();
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setPeerConnection(null);
    setStream((s) => {
      if (s) s.getTracks().forEach((t) => t.stop());
      return null;
    });
    setCall(null);
    setCallAccepted(false);
    setCallStatus('ended');
    callStartTime.current = null;
    setTimeout(() => {
      setCallStatus(null);
      setCallEnded(false);
      isEndingCall.current = false;
    }, 2500);
  };

  const startCall = async () => {
    if (callStatus) return;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (myVideo.current) myVideo.current.srcObject = mediaStream;

      const peer = new SimplePeer({ initiator: true, trickle: false, stream: mediaStream });
      peerRef.current = peer;
      setPeerConnection(peer);
      setCallStatus('ringing');
      startRingback(); // caller hears ringback tone

      peer.on('signal', (signalData) => {
        socketRef.current.emit('callUser', {
          receiverId: id,
          signalData,
          from: senderIdRef.current,
        });
      });

      peer.on('stream', (userStream) => {
        if (userVideo.current) userVideo.current.srcObject = userStream;
      });

      peer.on('error', (err) => console.error('Peer error:', err));
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus(null);
      stopRingSound();
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const answerCall = async () => {
    stopRingSound(); // stop incoming ring when accepted
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (myVideo.current) myVideo.current.srcObject = mediaStream;

      const peer = new SimplePeer({ initiator: false, trickle: false, stream: mediaStream });
      peerRef.current = peer;
      setPeerConnection(peer);

      peer.on('signal', (signal) => {
        socketRef.current.emit('answerCall', { to: call.from, signal });
      });

      peer.on('stream', (userStream) => {
        if (userVideo.current) userVideo.current.srcObject = userStream;
      });

      peer.on('error', (err) => console.error('Peer error:', err));

      peer.signal(call.signalData);
      setCallAccepted(true);
      setCallStatus('connected');
      callStartTime.current = Date.now();
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const rejectCall = () => {
    stopRingSound();
    socketRef.current.emit('rejectCall', { to: call.from });
    const entry = {
      type: 'incoming',
      status: 'rejected',
      with: user?.username || id,
      time: new Date().toISOString(),
      duration: null,
    };
    addCallHistory(entry);
    pushCallEvent(entry);
    setCall(null);
    setCallStatus(null);
  };

  const endCall = () => {
    isEndingCall.current = true;
    stopRingSound();
    socketRef.current.emit('endCall', { to: id });
    const dur = callStartTime.current ? Math.round((Date.now() - callStartTime.current) / 1000) : 0;
    const entry = {
      type: 'outgoing',
      status: callAccepted ? 'ended' : 'cancelled',
      with: user?.username || id,
      time: new Date().toISOString(),
      duration: callAccepted ? dur : null,
    };
    addCallHistory(entry);
    pushCallEvent(entry);
    cleanupCall(false);
  };

  // callAccepted socket fires → caller transitions from ringing → connected
  // handled in the socket listener above via peerRef; also update callStatus
  const onCallConnected = () => {
    setCallStatus('connected');
    callStartTime.current = Date.now();
  };












  // ── Forward message ───────────────────────────────────────────────────────
  const openForward = async (msg) => {
    setForwardMsg(msg);
    setForwardSearch('');
    if (friendsList.length === 0) {
      try {
        const res = await friendlistservice();
        setFriendsList(res.data?.activeFriends || []);
      } catch {}
    }
    setShowForward(true);
  };

  const sendForward = (targetFriendId) => {
    if (!forwardMsg || !socketRef.current) return;
    // Forward as a copy: same content/file but no replyTo, marked forwarded
    socketRef.current.emit('sendMessage', {
      senderId: senderid,
      receiverId: targetFriendId,
      messageText: forwardMsg.content || forwardMsg.messageText || '',
      fileUrl: forwardMsg.fileUrl || null,
      fileType: forwardMsg.fileType || null,
      fileName: forwardMsg.fileName || null,
      messageType: forwardMsg.messageType || 'text',
      timestamp: new Date().toISOString(),
    });
    setShowForward(false);
    setForwardMsg(null);
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
  <>
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
  <div className="md:w-[50%] lg:w-[40%] flex flex-col h-screen relative">
    {/* Header */}
    <div className="bg-[rgba(56,59,68,255)] flex justify-between px-3 py-2">
      <div className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]" onClick={Back}>
        <FontAwesomeIcon icon={faArrowLeft} className="text-[rgba(192,52,48,255)] text-xl mt-2 cursor-pointer" />
      </div>

      <div className="flex gap-x-3 px-3 rounded-full bg-[rgba(41,45,54,255)] text-white">
        <img  src={profile} alt="Profile" className="w-10 h-10 rounded-full" />
        <div className="text-start">
          <p>{user?.username}</p>
          <p>{onlineUsers.has(id) ? '🟢 Online' : '⚫ Offline'}</p>
          <p>{typeStatus ? 'Typing...' : ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Call button */}
        <div className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] flex items-center justify-center cursor-pointer">
          <FontAwesomeIcon
            icon={faPhone}
            className="text-[rgba(192,52,48,255)] text-lg"
            onClick={startCall}
            title="Start video call"
          />
        </div>
        {/* Call history button */}
        <div
          className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] flex items-center justify-center cursor-pointer relative"
          onClick={openHistory}
          title="Call history"
        >
          <FontAwesomeIcon icon={faPhone} className="text-[rgba(192,52,48,255)] text-sm rotate-[135deg]" />
          {unreadCallCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {unreadCallCount > 9 ? '9+' : unreadCallCount}
            </span>
          )}
        </div>
      </div>
    </div>

   {/* ── Outgoing call — Ringing screen (shown to CALLER) ─────────────── */}
   {callStatus === 'ringing' && (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
       <div className="bg-[rgba(41,45,54,255)] rounded-2xl p-8 flex flex-col items-center gap-5 shadow-2xl w-[300px]">
         <img src={profile} alt="" className="w-20 h-20 rounded-full border-4 border-[rgba(192,52,48,255)]" />
         <p className="text-white font-semibold text-lg">{user?.username}</p>
         <p className="text-gray-400 text-sm animate-pulse">Ringing…</p>
         {/* Animated ring rings */}
         <div className="relative flex items-center justify-center w-16 h-16">
           <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 animate-ping"></span>
           <div className="relative w-16 h-16 rounded-full bg-[rgba(192,52,48,255)] flex items-center justify-center">
             <FontAwesomeIcon icon={faPhone} className="text-white text-2xl" />
           </div>
         </div>
         <button
           onClick={endCall}
           className="mt-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
           title="Cancel call"
         >
           <FontAwesomeIcon icon={faPhoneSlash} className="text-xl" />
         </button>
         <p className="text-gray-500 text-xs">Tap red to cancel</p>
       </div>
     </div>
   )}

   {/* ── Incoming call banner (shown to RECEIVER) ─────────────────────── */}
   {call?.isReceivingCall && !callAccepted && callStatus !== 'ringing' && (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
       <div className="bg-[rgba(41,45,54,255)] rounded-2xl p-8 flex flex-col items-center gap-5 shadow-2xl w-[300px]">
         <img src={profile} alt="" className="w-20 h-20 rounded-full border-4 border-green-500" />
         <p className="text-white font-semibold text-lg">{user?.username}</p>
         <p className="text-gray-400 text-sm animate-pulse">Incoming video call…</p>
         <div className="flex gap-8 mt-2">
           <div className="flex flex-col items-center gap-1">
             <button
               onClick={rejectCall}
               className="bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
               title="Decline"
             >
               <FontAwesomeIcon icon={faPhoneSlash} className="text-xl" />
             </button>
             <span className="text-gray-400 text-xs">Decline</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <button
               onClick={answerCall}
               className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
               title="Accept"
             >
               <FontAwesomeIcon icon={faPhone} className="text-xl" />
             </button>
             <span className="text-gray-400 text-xs">Accept</span>
           </div>
         </div>
       </div>
     </div>
   )}

   {/* ── Active video call overlay ─────────────────────────────────────── */}
   {callStatus === 'connected' && (
     <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
       <video ref={userVideo} autoPlay playsInline className="w-full h-full object-cover" />
       <video
         ref={myVideo} autoPlay playsInline muted
         className="absolute bottom-24 right-4 w-32 h-44 object-cover rounded-xl border-2 border-white shadow-lg"
       />
       <button
         onClick={endCall}
         className="absolute bottom-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition"
         title="End call"
       >
         <FontAwesomeIcon icon={faPhoneSlash} className="text-2xl" />
       </button>
     </div>
   )}

   {/* ── Call ended toast ─────────────────────────────────────────────── */}
   {callStatus === 'ended' && (
     <div className="fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-none">
       <div className="bg-gray-800 text-white text-sm px-6 py-2 rounded-full shadow-lg">
         Call ended
       </div>
     </div>
   )}

   {/* ── Call History full panel ───────────────────────────────────────── */}
   {showHistory && (
     <div className="absolute inset-0 z-40 bg-[rgba(27,32,38,255)] flex flex-col">
       {/* Panel header */}
       <div className="bg-[rgba(56,59,68,255)] flex items-center gap-3 px-4 py-3">
         <button onClick={() => setShowHistory(false)} className="text-[rgba(192,52,48,255)] text-xl">
           <FontAwesomeIcon icon={faArrowLeft} />
         </button>
         <span className="text-white font-semibold text-base">Call History</span>
       </div>

       {/* Log list */}
       <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
         {callHistory.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
             <FontAwesomeIcon icon={faPhone} className="text-4xl opacity-30" />
             <p className="text-sm">No calls yet</p>
           </div>
         ) : (
           callHistory.map((entry, i) => {
             const isMissed  = entry.status === 'rejected' || entry.status === 'missed';
             const isCancelled = entry.status === 'cancelled';
             const isEnded   = entry.status === 'ended';
             const isOut     = entry.type === 'outgoing';

             const arrowColor = isMissed ? 'text-red-400' : isCancelled ? 'text-yellow-400' : 'text-green-400';
             const arrowIcon  = isOut ? '↗' : '↙';
             const statusText = isMissed    ? (isOut ? 'Rejected' : 'Missed call')
                              : isCancelled ? 'Cancelled'
                              : isEnded     ? `Video call · ${formatDuration(entry.duration)}`
                              : '';

              const callDate  = new Date(entry.time);
            //  const isToday   = callDate.toDateString() === new Date().toDateString();
            //  const dateStr   = isToday
            //    ? callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            //    : callDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
            
const dateStr = callDate.toLocaleString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});
             return (
               <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-[rgba(56,59,68,255)] hover:bg-[rgba(41,45,54,255)] transition">
                 {/* Avatar */}
                 <img src={profile} alt="" className="w-11 h-11 rounded-full flex-shrink-0" />

                 {/* Info */}
                 <div className="flex-1 min-w-0">
                   <p className="text-white text-sm font-medium">{entry.with}</p>
                   <p className={`text-xs flex items-center gap-1 mt-0.5 ${arrowColor}`}>
                     <span>{arrowIcon}</span>
                     <span>{statusText}</span>
                   </p>
                 </div>

                 {/* Time + call-back */}
                 <div className="flex flex-col items-end gap-2 flex-shrink-0">
                   <span className="text-gray-500 text-xs">{dateStr}</span>
                   <button
                     onClick={() => { setShowHistory(false); startCall(); }}
                     className="w-8 h-8 rounded-full bg-[rgba(56,59,68,255)] flex items-center justify-center hover:bg-[rgba(192,52,48,255)] transition"
                     title="Call back"
                   >
                     <FontAwesomeIcon icon={faPhone} className="text-[rgba(192,52,48,255)] hover:text-white text-xs" />
                   </button>
                 </div>
               </div>
             );
           })
         )}
       </div>
     </div>
   )}




    {/* Message List */}  
    <div   
      className="flex-1 overflow-y-auto pb-[30px]"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >  
      <ul>  
  {/* Merge messages + call events, sort by timestamp, group by date */}
  {(() => {
    const allItems = [
      ...messages.map(m => ({ ...m, _isCallEvent: false })),
      ...callEvents,
    ].sort((a, b) => new Date(a.timestamp ?? a.time) - new Date(b.timestamp ?? b.time));

    const grouped = [];
    let currentDate = '';
    allItems.forEach((item) => {
      const ts = item.timestamp ?? item.time;
      const dateLabel = formatTimestamp(ts);
      if (dateLabel !== currentDate) {
        currentDate = dateLabel;
        grouped.push({ date: currentDate, items: [item] });
      } else {
        grouped[grouped.length - 1].items.push(item);
      }
    });

    return grouped.map((group, gIdx) => (
      <li key={gIdx} className="list-none">
        <p className="text-xs text-gray-400 text-center mx-3 mt-4 mb-2">{group.date}</p>

        {group.items.map((item, idx) => {
          const isLast = gIdx === grouped.length - 1 && idx === group.items.length - 1;

          /* ── Call event bubble (WhatsApp-style centred system message) ── */
          if (item._isCallEvent) {
            const isMissed   = item.status === 'rejected' || item.status === 'missed';
            const isCancelled = item.status === 'cancelled';
            const textColor  = isMissed ? 'text-red-400' : isCancelled ? 'text-yellow-400' : 'text-green-400';
            const label      = isMissed    ? (item.type === 'outgoing' ? '📞 Rejected' : '📞 Missed call')
                             : isCancelled ? '📞 Cancelled'
                             : `📞 Video call · ${formatDuration(item.duration)}`;
            return (
              <li key={`ce-${idx}`} className="list-none flex justify-center my-2" ref={isLast ? lastMessageRef : null}>
                <div className={`flex items-center gap-2 bg-[rgba(41,45,54,255)] border border-[rgba(56,59,68,255)] rounded-full px-4 py-1.5 text-xs ${textColor}`}>
                  <span>{label}</span>
                  <span className="text-gray-500 text-[10px]">
                    {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </li>
            );
          }

          /* ── Normal message bubble ─────────────────────────────────── */
          const isOwn = String(item.senderId ?? item.sender) === String(senderid);
          return (
            <li key={`msg-${idx}`} className="mx-3 mt-4 rounded-md list-none group" ref={isLast ? lastMessageRef : null}>
              <div className={`text-sm flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>

                {/* ── Reply/Forward action buttons (appear on hover) ── */}
                <div className={`flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <button
                    onClick={() => {
                      setReplyTo({
                        _id: item._id || item.timestamp,
                        content: item.content || item.messageText || '',
                        messageType: item.messageType || 'text',
                        fileName: item.fileName || null,
                        fileUrl: item.fileUrl || null,
                        senderName: isOwn ? 'You' : (user?.username || 'Them'),
                      });
                      inputRef.current?.focus();
                    }}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 bg-[rgba(41,45,54,255)] px-2 py-1 rounded-full"
                    title="Reply"
                  >
                    <FontAwesomeIcon icon={faReply} className="text-[10px]" />
                    <span>Reply</span>
                  </button>
                  <button
                    onClick={() => openForward(item)}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 bg-[rgba(41,45,54,255)] px-2 py-1 rounded-full"
                    title="Forward"
                  >
                    <FontAwesomeIcon icon={faShare} className="text-[10px]" />
                    <span>Forward</span>
                  </button>
                </div>

                {/* ── Quoted reply bubble (if this message is a reply) ── */}
                {item.replyTo && (
                  <div className={`mb-1 px-2 py-1.5 rounded-lg border-l-4 max-w-[200px] text-xs ${
                    isOwn
                      ? 'border-[rgba(192,52,48,255)] bg-[rgba(56,59,68,255)] text-gray-300'
                      : 'border-yellow-500 bg-[rgba(56,59,68,255)] text-gray-300'
                  }`}>
                    <p className={`font-semibold text-[10px] mb-0.5 ${isOwn ? 'text-[rgba(192,52,48,255)]' : 'text-yellow-400'}`}>
                      {item.replyTo.senderName}
                    </p>
                    <p className="truncate">
                      {item.replyTo.messageType === 'image' ? '📷 Photo'
                       : item.replyTo.messageType === 'audio' ? '🎤 Voice message'
                       : item.replyTo.messageType === 'file'  ? `📎 ${item.replyTo.fileName || 'File'}`
                       : (item.replyTo.content || 'Message')}
                    </p>
                  </div>
                )}

                {/* Image */}
                {item.messageType === 'image' && item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer">
                    <img src={item.fileUrl} alt={item.fileName || 'attachment'}
                      className="max-w-[220px] max-h-[220px] rounded-lg object-cover border border-gray-600 cursor-pointer" />
                  </a>
                )}

                {/* File */}
                {item.messageType === 'file' && item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition ${
                      isOwn ? 'bg-[rgba(56,59,68,255)] text-white hover:bg-[rgba(80,84,96,255)]'
                            : 'bg-[rgba(56,59,68,255)] text-yellow-500 hover:bg-[rgba(80,84,96,255)]'
                    }`}>
                    <span>📎</span>
                    <span className="underline truncate max-w-[180px]">{item.fileName || 'Download file'}</span>
                  </a>
                )}

                {/* Audio */}
                {item.messageType === 'audio' && item.fileUrl && (
                  <div className={`flex flex-col gap-1 px-3 py-2 rounded-lg text-xs ${
                    isOwn ? 'bg-[rgba(56,59,68,255)] text-white' : 'bg-[rgba(56,59,68,255)] text-yellow-500'
                  }`}>
                    <span className="mb-1">🎤 Voice message</span>
                    <audio controls src={item.fileUrl} className="h-8 w-48" />
                  </div>
                )}

                {/* Text */}
                {(item.messageType === 'text' || !item.messageType) && (
                  <span className={isOwn ? 'text-white' : 'text-yellow-500'}>
                    {item.content || item.messageText}
                  </span>
                )}

                <span className="text-xs text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </li>
          );
        })}
      </li>
    ));
  })()}
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
  </>
  );
};

export default TryChat;



