
import axios, { AxiosResponse } from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const latestmessageservice = async (friendid) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("No token found in localStorage");
    }

    try {//http://localhost:5000/api/latestMessage 
        const response = await axios.get(`${apiUrl}/latestMessage`, {
            params:{
                receiverId:friendid
            },
            headers: {
                Authorization: `${token}`, 
            },
        });
        //  console.log("message,time", response); 
        return response;
    } catch (error) {
        console.error("Error fetching request service:", error);
        throw error; 
    }
};


