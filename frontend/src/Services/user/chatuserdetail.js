import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const getChatUserDetails = async (userId)=> {
  try {
    const token = sessionStorage.getItem('token');
    //http://localhost:5000/api/chatuserdetail 
    const response = await axios.post(`${apiUrl}/chatuserdetail`, {
      id: userId
    },{
      headers: {
        Authorization: `${token}`, 
      },
    });
      
    console.log("service response",response);
    const senderId = response.data.author;
    const user = response.data.user;
    return {user,senderId};
  
    
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};
