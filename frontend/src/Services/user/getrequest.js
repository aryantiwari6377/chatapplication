
import axios, { AxiosResponse } from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const getrequestservice = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        throw new Error("No token found in sessionStorage");
    }

    try {//http://localhost:5000/api/getrequests 
        const response = await axios.get(`${apiUrl}/getrequests`, {
            headers: {
                Authorization: `${token}`, 
            },
        });
        // console.log("Notification requests", response); 
        return response;
    } catch (error) {
        console.error("Error fetching request service:", error);
        throw error; 
    }
};
