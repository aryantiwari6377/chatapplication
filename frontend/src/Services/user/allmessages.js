
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const allmessageservice = async(id,senderid) => {
      try{
    const token = sessionStorage.getItem('token');
            //http://localhost:5000/api/allmessages 
          const response = await axios.get(`${apiUrl}/allmessages`, {
            params: { id, senderid },
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



