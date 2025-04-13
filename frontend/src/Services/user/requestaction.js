
import axios, { AxiosResponse } from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const requestservice = async (senderId, value) => {
  try {
    const token = sessionStorage.getItem('token');
    //http://localhost:5000/api/requestaction 
    const response= await axios.post(`${apiUrl}/requestaction`, {
      senderId,
      value,
    },{
        headers: {
            Authorization: `${token}`, 
        },
    });
    // console.log("Request response", response);
    return response;
  } catch (error) {
    console.error("Error in requestservice", error);
    throw error;
  }
};
