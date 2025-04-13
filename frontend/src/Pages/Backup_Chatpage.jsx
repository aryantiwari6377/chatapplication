// import { faArrowLeft, faCamera, faMicrophone, faPaperclip, faPhone } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import React, { useEffect, useState, useRef } from 'react';
// import profile from "../images/profile.jpg";
// import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getChatUserDetails } from '../../src/Services/user/chatuserdetail';
// import { io } from 'socket.io-client';
// import { allmessageservice } from '../Services/user/allmessages';

// const Chatpage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [senderid, setsenderid] = useState('');
//   const [userStatus, setUserStatus] = useState({});
//   const [typeStatus,   setTypeStatus] = useState(false);

//   const typingTimeout = useRef(null);


//   const socket = io('http://localhost:5000');

//   const Back = () => {
//     navigate(-1);
//   };


 
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp); 
    
//     let hours = date.getHours();
//     const minutes = date.getMinutes(); 
//     const ampm = hours >= 12 ? 'PM' : 'AM'; 
    
//     hours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; 
  
//     return `${hours}:${formattedMinutes} ${ampm}`; 
//   };

//   const userdetail = async () => {
//     if (!id) {

//       console.error("No user ID found.");
//       return;
//     }
    
//     try {
//       const res = await getChatUserDetails(id);
//       if (res) {
//         console.log("User details:", res);
//         console.log(res.senderId);
//         console.log("check state value",senderid);
//         setsenderid(res.senderId);
//         setUser(res.user);
//       }

     
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };
    

//   const sendMessage = () => {
//     if (!newMessage || newMessage.trim() === "") {
//       console.error("Message cannot be empty!");
//       return;
//     }
                  
//     const messageData = {
//       receiverId: id,
//       messageText: newMessage,
//       senderId: senderid
//     };
//     console.log(newMessage);

//     socket.emit('sendMessage', messageData);
//   };

  
//   const allmessages = async(id,senderid)=>{
//        const response = await allmessageservice(id,senderid);
//       //  console.log("understand using it",response.data.messages);
//        setMessages(response.data.messages);
      
//   }
  
  
//   useEffect(() => {
     
//     socket.on("connect", ()=>{console.log("connected",socket.id);});
     
     
//     const fetchData = async () => {
//       try {
//         await userdetail();    
//         await allmessages(id,senderid);
//       } catch (error) {
//         console.error("Error fetching messages or user details:", error);
//       }
//     };
//     fetchData(); 
   

//     socket.on('receiveMessage', (message) => {
//       setMessages((prevMessages) => {
//         const newMessages = [...prevMessages, message];
//         return newMessages;
//       });
//     });
     
//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, []); 
  

//   useEffect(() => {
//     if (senderid) {
//       allmessages(id, senderid);
//     }
//   }, [senderid]);


//   useEffect(() => {
    
//     socket.emit("userOnline", id);

    
//     socket.on("updateUserStatus", ({ id, status }) => {
//       setUserStatus((prevStatus) => ({
//         ...prevStatus,
//         [id]: status,
//       }));
//     });

   
//     return () => {
//       socket.emit("userDisconnected", id);
//     };
//   }, [id]);


//   const handleTyping = (e) => {
//     setNewMessage(e.target.value);
//     socket.emit('typing', { senderid, receiverId: id, isTyping: true });

   
//     clearTimeout(typingTimeout.current);

//     typingTimeout.current = setTimeout(() => {
//       socket.emit('typing', { senderid, receiverId: id, isTyping: false });
//     }, 2000);
//   };


//   useEffect(() => {
//     socket.on('displayTyping', ({ senderid, isTyping }) => {
//       if (senderid !== id) return; 
//       setTypeStatus(isTyping);
//     });

//     return () => {
//       socket.off('displayTyping');
//     };
//   }, [id]);

   


//   return (
//     <div className="bg-[rgba(27,32,38,255)] min-h-[100vh] text-white">
//       <div className="bg-[rgba(56,59,68,255)] flex justify-between px-3 py-2 ">
       
//         <div
//           className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]"
//           onClick={Back}
//         >
//           <FontAwesomeIcon icon={faArrowLeft} className="text-[rgba(192,52,48,255)] text-xl mt-2" />
//         </div>

//         <div className="flex gap-x-3 px-3 rounded-full bg-[rgba(41,45,54,255)] text-white ">
//           <div className="w-10 h-10">
//             <img src={profile} className="rounded-full" alt="Profile" />
//           </div>
//           <div className="text-start">
//             <p>{user?.username}</p>
//             {/* <p className="text-sm">typing...</p> */}
//             <p>{userStatus[id] === "online" ? "Online" : "Offline"}</p>
//             <p>{typeStatus ? 'Typing...' : ''}</p>
         
//           </div>
//         </div>

//         <div className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]">
//           <FontAwesomeIcon icon={faPhone} className="text-[rgba(192,52,48,255)] text-xl mt-2" />
//         </div>
//       </div>

//       <div className=''>
//         <p>day(today)</p>
//         <p>messages</p>
       
//         <ul>
//         {
//   messages.map((message, index) => (
//     <li
//       key={index}
//       className={`mx-3 mt-4 rounded-md ${
//         message.sender === senderid
//           ? "self-end   text-right"
//           : "self-start  text-yellow-500 text-left"
//       }`}
//     >
     
//       {message.content} 

//      <span className='ml-2 text-xs text-white'>{formatTimestamp(message.timestamp)}</span>
     
//     </li>
//   ))
// }

//             </ul>
//       </div>



      
//       <div className=" w-full flex justify-evenly md:justify-start md:gap-x-6 fixed bottom-0">
//         <div className="flex gap-x-2">
//           <FontAwesomeIcon icon={faFaceSmile} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" />
//           <input
//             type="text"
//             placeholder="Type a message"
//             onChange={handleTyping}//(e) => setNewMessage(e.target.value)  
//             className="bg-[rgba(41,45,54,255)] outline-none rounded-full h-6 text-white"
//           />
//           <FontAwesomeIcon icon={faPaperclip} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" onClick={sendMessage} />
//           <FontAwesomeIcon icon={faCamera} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" onClick={sendMessage} />
//         </div>
//         <div className="bg-[rgba(192,52,48,255)] h-6 w-6 rounded-full">
//           <FontAwesomeIcon icon={faMicrophone} className="text-xl" onClick={sendMessage} />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Chatpage;












import { faArrowLeft, faCamera, faMicrophone, faPaperclip, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import profile from "../images/profile.jpg";
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatUserDetails } from '../Services/user/chatuserdetail';
import { io } from 'socket.io-client';
import { allmessageservice } from '../Services/user/allmessages';

const  Backup_Chatpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderid, setsenderid] = useState('');
  const [userStatus, setUserStatus] = useState({});
  const [typeStatus, setTypeStatus] = useState(false);

  const lastMessageRef = useRef(null);
  const typingTimeout = useRef(null);

  const socket = io('http://localhost:5000');

  const Back = () => {
    navigate(-1);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
  
    const timeDifference = now - date;
 
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' }); 
    const year = date.getFullYear();
    
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return `${day} ${month} ${year}`; 
    }
  };

  const userdetail = async () => {
    if (!id) {
      console.error("No user ID found.");
      return;
    }

    try {
      const res = await getChatUserDetails(id);
      if (res) {
        setsenderid(res.senderId);
        setUser(res.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const sendMessage = () => {
    if (!newMessage || newMessage.trim() === "") {
      console.error("Message cannot be empty!");
      return;
    }
     
    const messageData = {
      receiverId: id,
      messageText: newMessage,
      senderId: senderid
    };
    socket.emit('sendMessage', messageData);
  };


  const allmessages = async (id, senderid) => {
    const response = await allmessageservice(id, senderid);
    setMessages(response.data.messages);
  };

   
  useEffect(() => {
    socket.on("connect", () => { console.log("connected", socket.id); });
       
    const fetchData = async () => {
      try {
        await userdetail();
        await allmessages(id, senderid);
      } catch (error) {
        console.error("Error fetching messages or user details:", error);
      }
    };
    fetchData(); 
         
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        console.log("check state is update or not",newMessages); //not show 
        return newMessages;
      });
    });
         
    return () => {
      socket.off('receiveMessage');
    };
  }, []);
     
   useEffect(() => {
    if (senderid) {
      allmessages(id, senderid);
    }
  }, [senderid]);
   
  useEffect(() => {
    socket.emit("userOnline", id);
        
    socket.on("updateUserStatus", ({ id, status }) => {
      setUserStatus((prevStatus) => ({
        ...prevStatus,
        [id]: status,
      }));
    });

    console.log("status is",userStatus); //not show(show but empty)
       
    return () => {
      socket.emit("userDisconnected", id);
    };
  }, [id]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { senderid, receiverId: id, isTyping: true });
     
    clearTimeout(typingTimeout.current);
    
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing', { senderid, receiverId: id, isTyping: false });
    }, 2000);
  };
             
  useEffect(() => {
    socket.on('displayTyping', ({ senderid, isTyping }) => {
      if (senderid !== id) return;
      setTypeStatus(isTyping);
    });
     
    return () => {
      socket.off('displayTyping');
    };
  }, [id]);
           
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

  useEffect(() => {
    
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);





  return (
    <div className="bg-[rgba(27,32,38,255)] min-h-[100vh] text-white">
      <div className="bg-[rgba(56,59,68,255)] flex justify-between px-3 py-2">
        <div
          className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]"
          onClick={Back}
        >  
          <FontAwesomeIcon icon={faArrowLeft} className="text-[rgba(192,52,48,255)] text-xl mt-2" />
        </div>
        
        <div className="flex gap-x-3 px-3 rounded-full bg-[rgba(41,45,54,255)] text-white ">
          <div className="w-10 h-10">
            <img src={profile} className="rounded-full" alt="Profile" />
          </div>
          <div className="text-start">
            <p>{user?.username}</p>
            <p>{userStatus[id] === "online" ? "Online" : "Offline"}</p>
            <p>{typeStatus ? 'Typing...' : ''}</p>
          </div>
        </div>
           
        <div className="rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]">
          <FontAwesomeIcon icon={faPhone} className="text-[rgba(192,52,48,255)] text-xl mt-2" />
        </div>
      </div>
        
      <div className='pb-[50px]'>
        <ul>
          {groupedMessages.map((group, index) => (
            <div key={index}>
              <p className="text-xs text-white mx-3 mt-4">{group.date}</p>
              {group.messages.map((message, index) => {
                const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <li key={index} className={`mx-3 mt-4 rounded-md`}>
                    <p className={`text-sm ${
                      message.sender === senderid
                        ? "self-end text-right"
                        : "self-start text-yellow-500 text-left"
                    }`}>
                      {message.content}<span className="ml-2 text-xs text-white">{messageTime}</span>
                    </p>
                    
                  </li>
                );
              })}
            </div>
          ))}
        </ul>
      </div>

      <div className="w-full flex justify-evenly md:justify-start md:gap-x-6 fixed bottom-0">
        <div className="flex gap-x-2">
          <FontAwesomeIcon icon={faFaceSmile} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" />
          <input
            type="text"
            placeholder="Type a message"
            onChange={handleTyping}
            className="bg-[rgba(41,45,54,255)] outline-none rounded-full h-6 text-white"
          />
          <FontAwesomeIcon icon={faPaperclip} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" onClick={sendMessage} />
          <FontAwesomeIcon icon={faCamera} className="text-[rgba(192,52,48,255)] cursor-pointer text-xl" onClick={sendMessage} />
        </div>
        <div className="bg-[rgba(192,52,48,255)] h-6 w-6 rounded-full">
          <FontAwesomeIcon icon={faMicrophone} className="text-xl" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default  Backup_Chatpage;






