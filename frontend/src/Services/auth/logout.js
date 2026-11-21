import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const logoutfun = async()=>{
 
    try{
     const token = localStorage.getItem("token");
      //http://localhost:5000/api/logout 
     const res =  await axios.post(`${apiUrl}/logout`);
     if(res.status == 200){
     localStorage.removeItem("token");
     localStorage.removeItem("refreshtoken");
     localStorage.removeItem("senderId");
     }
   
     return res;
    }
    catch(error){
        console.log(error);
    }
}