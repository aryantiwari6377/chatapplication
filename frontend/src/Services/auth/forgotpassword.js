import axios from "axios"
const apiUrl = process.env.REACT_APP_API_URL;

export const forgotservice = async(email)=>{
   
  
    try {//http://localhost:5000/api/forgot 
        const response = await axios.post(`${apiUrl}/forgot`, {email});
        
        console.log("Response data:", response.data);
    
        return response;
      } catch (error) {
        console.log(error);
        throw new Error('Login failed');
      }
}