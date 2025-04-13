import axios from "axios"
const apiUrl = process.env.REACT_APP_API_URL;

export const changepaswordservice = async(newpassword,token) =>{
    //http://localhost:5000/api/reset-password/${token} 
    const res = axios.post(`${apiUrl}/reset-password/${token}`,{newpassword}); 
    console.log("changeservice",res);
    return res;
}