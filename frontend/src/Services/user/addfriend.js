import axios, { AxiosResponse } from "axios";
const apiUrl = process.env.REACT_APP_API_URL;



export const addfriendservice = async(email) => {
      try{
    const token = sessionStorage.getItem('token');
    //http://localhost:5000/api/addfriend 
    const response = await axios.post(`${apiUrl}/addfriend`, { email},{
            headers: {
                Authorization: `${token}`, 
              },
          });
          console.log(response);
          return response;

        }
        catch(error){
       throw new Error('Network response was not ok: ' + error);
        }
        }



