import axios from "axios";
import { profileImage } from "../../Redux/slices/profileSlice";

// store reference injected at app startup via setStore()
let _store = null;
export const setStore = (store) => { _store = store; };

const apiUrl = process.env.REACT_APP_API_URL;

export const loginservice = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, { email, password });
    console.log("Response data:", response.data);

    // Hydrate profileUrl into Redux immediately on login so
    // Try.jsx and TryChat.jsx can use it without visiting Profile first
    const profileImg = response.data?.user?.profileImage;
    if (profileImg && _store) {
      _store.dispatch(profileImage(profileImg));
    }

    return response;
  } catch (error) {
    console.log(error);
    throw error; // re-throw so Login.jsx catch block can read error.response
  }
}
