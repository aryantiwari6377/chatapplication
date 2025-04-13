// import mongoose from "mongoose";

// const connectdb =async()=>{
//     try{
// await mongoose.connect("mongodb+srv://aryan:aryan@cluster0.o1st8ov.mongodb.net/chatapplication?retryWrites=true&w=majority&appName=Cluster0");

// mongoose.connection.on('connected',()=>{
//     console.log("mongodb connected")
// })

// mongoose.connection.on('error',()=>{
//     console.log('error');
// })
//     }
//     catch(error){
//         console.log(error);
//     }
// }

// export default connectdb ;

import mongoose from "mongoose";

const connectdb = async () => {
  try {
    
    await mongoose.connect(
      "mongodb+srv://aryan:aryan@cluster0.o1st8ov.mongodb.net/chatapplication?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message); 
    throw error; 
  }
};

export default connectdb;
