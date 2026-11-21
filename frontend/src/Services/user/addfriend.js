import axios, { AxiosResponse } from "axios";
const apiUrl = process.env.REACT_APP_API_URL;



export const addfriendservice = async(email) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${apiUrl}/addfriend`, { email }, {
      headers: {
        Authorization: `${token}`, 
      },
    });
    console.log(response);
    return response;
  } catch(error) {
    throw error;
  }
};



