// import express from "express";
// import { Server } from "socket.io";
// const app = express();
// import dotenv from "dotenv";
// import cors from "cors";
// import connectdb from "./db.js";
// import userroute from "./routes/userroutes.js";
// import Message from "./models/messagemodel.js"
// import { verifyToken } from "./middlewares/verifytoken.js";
// //import { startEmailWorker } from "./emailWorker.js";

// dotenv.config();
// app.use(cors());

// app.use(express.json());

// app.use('/api', userroute);

// await connectdb();

// // Start SQS email worker (polls queue and sends emails via nodemailer)
// //startEmailWorker();



// const server = app.listen(5000,()=>{ console.log("server is runing")});

// const io = new Server(server,{
//     cors: {
//       origin: '*', 
//       methods: ['GET', 'POST'],
//     },
//   });
//   const onlineUsers = new Set();
//   // const onlineUsers = new Map(); 
  
//    const userSockets = {};
  
  
//   io.on('connection',(socket)=>{
//     console.log(`User connected: ${socket.id}`);
  
//     const token = socket.handshake.query.token;
//     // console.log("token is",token);
//     const user = verifyToken(token);

//     // const onlineUsers = new Map();
     
    


//     if (!user) {
//         console.log('Invalid token. Disconnecting socket:', socket.id);
//         socket.disconnect();
//         return;
//     }

//     const userId = user.id;
    
//      console.log(`${userId} connected and is online`);
  
//      if (!userSockets[userId]) {
//       userSockets[userId] = [];
//   }
//   userSockets[userId].push(socket.id);
  
//     onlineUsers.add(user.id);
//     io.emit('onlineUsers', Array.from(onlineUsers));
    
//     console.log('User connected:', user.id);
//     console.log('Current online users:', onlineUsers);
  
//    //new
//    socket.on('callUser', ({ receiverId, signalData, from }) => {
//     const receiverSockets = userSockets[receiverId] || [];
//     receiverSockets.forEach(socketId => {
//         io.to(socketId).emit('incomingCall', { from, signalData });
//     });
// });

// // Handle Call Answering  
// socket.on('answerCall', ({ to, signal }) => {
//     const senderSockets = userSockets[to] || [];
//     senderSockets.forEach(socketId => {
//         io.to(socketId).emit('callAccepted', signal);
//     });
// });

// // Handle Call Rejection
// socket.on('rejectCall', ({ to }) => {
//     const senderSockets = userSockets[to] || [];
//     senderSockets.forEach(socketId => {
//         io.to(socketId).emit('callRejected');
//     });
// });

// // Handle Call End
// socket.on('endCall', ({ to }) => {
//     const senderSockets = userSockets[to] || [];
//     senderSockets.forEach(socketId => {
//         io.to(socketId).emit('callEnded');
//     });
// });




//     socket.on('sendMessage', async ({ senderId, receiverId, messageText, fileUrl, fileType, fileName, messageType, replyTo }) => {
//       try {
//           // Build message payload — support both text and file messages
//           const messagePayload = {
//               sender: senderId,
//               receiver: receiverId,
//               content: messageText || '',
//               messageType: messageType || 'text',
//           };

//           // Attach file metadata if present
//           if (fileUrl) {
//               messagePayload.fileUrl = fileUrl;
//               messagePayload.fileType = fileType || null;
//               messagePayload.fileName = fileName || null;
//           }

//           // Attach reply-to snapshot if present
//           if (replyTo) {
//               messagePayload.replyTo = replyTo;
//           }

//           const message = new Message(messagePayload);
//           await message.save();

//           console.log("New message saved:", message);

//           const senderSockets = userSockets[senderId] || [];
//           senderSockets.forEach(socketId => {
//               io.to(socketId).emit('receiveMessage', message);
//           });

//           const receiverSockets = userSockets[receiverId] || [];
//           receiverSockets.forEach(socketId => {
//               io.to(socketId).emit('receiveMessage', message);
//           });

//           console.log(`Message emitted to sender ${senderId} and receiver ${receiverId}`);
//       } catch (error) {
//           console.error("Error handling sendMessage:", error);
//       }
//   });
  

   
   
//   socket.on('userOffline', (userId) => {
//     console.log('User offline:', userId);
//     onlineUsers.delete(userId);
//     io.emit('onlineUsers', Array.from(onlineUsers));
// });
      
  
     
//     socket.on('typing', ({ senderId, receiverId, isTyping }) => {
//       socket.to(receiverId).emit('displayTyping', { senderId, isTyping });
//     });
     


// //     socket.on('disconnect', () => {
// //       onlineUsers.delete(user.id);
// //       io.emit('onlineUsers', Array.from(onlineUsers));
// //       console.log('User disconnected:', user.id);
// //   });


// //pls check need to check scket id=== arrya matching socket id in multiple device case

//   socket.on('disconnect', () => {
//   // Remove disconnected socket ID
//   userSockets[user.id] = (userSockets[user.id] || [])
//     .filter(socketId => socketId !== socket.id);

//   // Mark user offline only if no connections remain
//   if (userSockets[user.id].length === 0) {
//     delete userSockets[user.id];
//     onlineUsers.delete(user.id);
//   }

//   io.emit('onlineUsers', Array.from(onlineUsers));

//   console.log('User disconnected:', user.id);
// });
// })



  import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectdb from "./db.js";
import userroute from "./routes/userroutes.js";
import Message from "./models/messagemodel.js";
import { verifyToken } from "./middlewares/verifytoken.js";
//import { startEmailWorker } from "./emailWorker.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://konekto-web-eta.vercel.app",
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/+$/, "")); // removes accidental spaces or trailing '/'

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header (like health checks, curl, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Lightweight health check route for Render / cron-job.org / UptimeRobot
app.get("/health", (req, res) => {
  console.log(`[HEALTH] Ping received at ${new Date().toISOString()} from ${req.ip}`);
  res.status(200).json({ status: "ok" });
});

app.use("/api", userroute);

await connectdb();

// Start SQS email worker (polls queue and sends emails via nodemailer)
//startEmailWorker();

// Use Render's dynamic PORT in production, fallback to 5000 locally
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Socket CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Set();
// const onlineUsers = new Map();

const userSockets = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const token = socket.handshake.query.token;
  // console.log("token is",token);
  const user = verifyToken(token);

  // const onlineUsers = new Map();

  if (!user) {
    console.log("Invalid token. Disconnecting socket:", socket.id);
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
  io.emit("onlineUsers", Array.from(onlineUsers));

  console.log("User connected:", user.id);
  console.log("Current online users:", onlineUsers);

  //new
  socket.on("callUser", ({ receiverId, signalData, from }) => {
    const receiverSockets = userSockets[receiverId] || [];
    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("incomingCall", { from, signalData });
    });
  });

  // Handle Call Answering
  socket.on("answerCall", ({ to, signal }) => {
    const senderSockets = userSockets[to] || [];
    senderSockets.forEach((socketId) => {
      io.to(socketId).emit("callAccepted", signal);
    });
  });

  // Handle Call Rejection
  socket.on("rejectCall", ({ to }) => {
    const senderSockets = userSockets[to] || [];
    senderSockets.forEach((socketId) => {
      io.to(socketId).emit("callRejected");
    });
  });

  // Handle Call End
  socket.on("endCall", ({ to }) => {
    const senderSockets = userSockets[to] || [];
    senderSockets.forEach((socketId) => {
      io.to(socketId).emit("callEnded");
    });
  });

  socket.on(
    "sendMessage",
    async ({
      senderId,
      receiverId,
      messageText,
      fileUrl,
      fileType,
      fileName,
      messageType,
      replyTo,
    }) => {
      console.log("sendMessage received:", {
        senderId,
        receiverId,
        messageType: messageType || "text",
        hasFile: Boolean(fileUrl),
        fileName: fileName || null,
      });

      try {
        if (!senderId || !receiverId) {
          console.error("sendMessage missing senderId or receiverId");
          return;
        }

        // Build message payload — support both text and file messages
        const messagePayload = {
          sender: senderId,
          receiver: receiverId,
          content: messageText || "",
          messageType: messageType || (fileUrl ? "file" : "text"),
        };

        // Attach file metadata if present
        if (fileUrl) {
          messagePayload.fileUrl = fileUrl;
          messagePayload.fileType = fileType || null;
          messagePayload.fileName = fileName || null;
        }

        // Attach reply-to snapshot if present
        if (replyTo) {
          messagePayload.replyTo = replyTo;
        }

        const message = new Message(messagePayload);
        await message.save();

        console.log("New message saved:", message._id, message.messageType);

        const senderSockets = userSockets[senderId] || [];
        senderSockets.forEach((socketId) => {
          io.to(socketId).emit("receiveMessage", message);
        });

        const receiverSockets = userSockets[receiverId] || [];
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("receiveMessage", message);
        });

        console.log(
          `Message emitted to sender ${senderId} and receiver ${receiverId}`
        );
      } catch (error) {
        console.error("Error handling sendMessage:", error);
      }
    }
  );

  socket.on("userOffline", (userId) => {
    console.log("User offline:", userId);
    onlineUsers.delete(userId);
    io.emit("onlineUsers", Array.from(onlineUsers));
  });

  socket.on("typing", ({ senderId, receiverId, isTyping }) => {
    socket.to(receiverId).emit("displayTyping", { senderId, isTyping });
  });

  //     socket.on('disconnect', () => {
  //       onlineUsers.delete(user.id);
  //       io.emit('onlineUsers', Array.from(onlineUsers));
  //       console.log('User disconnected:', user.id);
  //   });

  //pls check need to check scket id=== arrya matching socket id in multiple device case

  socket.on("disconnect", () => {
    // Remove disconnected socket ID
    userSockets[user.id] = (userSockets[user.id] || []).filter(
      (socketId) => socketId !== socket.id
    );

    // Mark user offline only if no connections remain
    if (userSockets[user.id].length === 0) {
      delete userSockets[user.id];
      onlineUsers.delete(user.id);
    }

    io.emit("onlineUsers", Array.from(onlineUsers));

    console.log("User disconnected:", user.id);
  });
});
