import express from "express";
import { Server } from "socket.io";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import connectdb from "./db.js";
import userroute from "./routes/userroutes.js";
import Message from "./models/messagemodel.js"
import { verifyToken } from "./middlewares/verifytoken.js";

dotenv.config();
app.use(cors());

app.use(express.json());

app.use('/api', userroute);

await connectdb();



const server = app.listen(5000,()=>{ console.log("server is runing")});

const io = new Server(server,{
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
    },
  });
  const onlineUsers = new Set();
  // const onlineUsers = new Map(); 
  
   const userSockets = {};
  
  
  io.on('connection',(socket)=>{
    console.log(`User connected: ${socket.id}`);
  
    const token = socket.handshake.query.token;
    // console.log("token is",token);
    const user = verifyToken(token);

    // const onlineUsers = new Map();
     
    


    if (!user) {
        console.log('Invalid token. Disconnecting socket:', socket.id);
        socket.disconnect();
        return;
    }

    const userId = user.id;
    
     console.log(`${userId} connected and is online`);
  
     if (!userSockets[userId]) {
      userSockets[userId] = [];
  }
  userSockets[userId].push(socket.id);
  
    onlineUsers.add(user.id);
    io.emit('onlineUsers', Array.from(onlineUsers));
    
    console.log('User connected:', user.id);
    console.log('Current online users:', onlineUsers);
  
   //new
   socket.on('callUser', ({ receiverId, signalData, from }) => {
    const receiverSockets = userSockets[receiverId] || [];
    receiverSockets.forEach(socketId => {
        io.to(socketId).emit('incomingCall', { from, signalData });
    });
});

// Handle Call Answering  
socket.on('answerCall', ({ to, signal }) => {
    const senderSockets = userSockets[to] || [];
    senderSockets.forEach(socketId => {
        io.to(socketId).emit('callAccepted', signal);
    });
});

// Handle Call Rejection
socket.on('rejectCall', ({ to }) => {
    const senderSockets = userSockets[to] || [];
    senderSockets.forEach(socketId => {
        io.to(socketId).emit('callRejected');
    });
});

// Handle Call End
socket.on('endCall', ({ to }) => {
    const senderSockets = userSockets[to] || [];
    senderSockets.forEach(socketId => {
        io.to(socketId).emit('callEnded');
    });
});




    socket.on('sendMessage', async ({ senderId, receiverId, messageText }) => {
      try {
         
          const message = new Message({
              sender: senderId,
              receiver: receiverId,
              content: messageText,
          });
          await message.save();
  
          console.log("New message saved:", message);
  
          
          const senderSockets = userSockets[senderId] || [];
          senderSockets.forEach(socketId => {
              io.to(socketId).emit('receiveMessage', message);
          });
  
          const receiverSockets = userSockets[receiverId] || [];
          receiverSockets.forEach(socketId => {
              io.to(socketId).emit('receiveMessage', message);
          });
          
          console.log(`Message emitted to sender ${senderId} and receiver ${receiverId}`);
      } catch (error) {
          console.error("Error handling sendMessage:", error);
      }
  });
  

   
   
  socket.on('userOffline', (userId) => {
    console.log('User offline:', userId);
    onlineUsers.delete(userId);
    io.emit('onlineUsers', Array.from(onlineUsers));
});
      
  
     
    socket.on('typing', ({ senderId, receiverId, isTyping }) => {
      socket.to(receiverId).emit('displayTyping', { senderId, isTyping });
    });
     


    socket.on('disconnect', () => {
      onlineUsers.delete(user.id);
      io.emit('onlineUsers', Array.from(onlineUsers));
      console.log('User disconnected:', user.id);
  });


  
})



  