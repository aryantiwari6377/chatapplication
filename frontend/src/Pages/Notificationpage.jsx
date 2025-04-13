import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import profile1 from '../images/profile1.jpg';
import { getrequestservice } from '../Services/user/getrequest';
import { useNavigate } from 'react-router-dom';
import { requestservice } from "../Services/user/requestaction";
import { useSelector, useDispatch } from 'react-redux';
import { profileDetail, profileImage } from '../Redux/slices/profileSlice';
import {notification} from '../Redux/slices/loadingSlice';

function Notificationpage() {
  const [friends, setFriends] = useState([]); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userimage = useSelector(state => state.profile.profileUrl);
  const friendrequest = useSelector(state => state.loader.requests);

  const handlerequests = async () => {
    const res = await getrequestservice();
    console.log(res);
   // setFriends(res.data.requestFriends);
    dispatch(notification(res.data.requestFriends));
  };

  const requestdecision = async (senderId, value) => {
    const res = await requestservice(senderId, value);
   if(res.status === 401){
     navigate("/login");
   }
    if(res.status==200){ 
      setFriends((prevFriends) => prevFriends.filter(friend => friend._id !== senderId));
    }
  
  };

  useEffect(() => {
    handlerequests();
  }, []);

  return (
    <div>
      <div className='flex justify-between mx-2 pt-4'>
        <div>
          <h2 className='font-bold text-2xl'>Notification</h2>
        </div>
        <div onClick={() => navigate("/check")} className='mr-[30px]'>
          <FontAwesomeIcon icon={faXmark} className='text-xl'/>
        </div>
      </div>

      <div className='mt-8 mx-2 flex flex-col gap-8 md:flex-row  md:gap-12'>
   
        {friendrequest.length === 0 ? (  
  <div className='w-full flex pt-[120px] justify-center h-screen text-xl font-bold'>
    <p >No notifications at the moment</p>
    </div>

) : (
  
  friendrequest.map((friend) => (
    <div key={friend._id} className='md:w-[300px] border-[#E0E0E0] border-[2px] rounded-md p-4'>
      <div className='flex  gap-x-3'>
        <div className='h-12 w-12 '>
          <img src={ userimage || profile1} className='h-full w-full' alt={friend.username} />
        </div>
        <div className='text-start'>
          <p>{friend.username}</p>
          <p>2 ago</p>
        </div>
      </div>
      <div className='flex justify-center gap-x-8 mt-2 md:gap-x-8'>
        <button
          className="bg-black text-white font-bold hover:bg-[rgb(85,44,212)] p-2 rounded-md"
          onClick={() => requestdecision(friend._id, 'accept')}
        >
          Accept
        </button>
        <button
          className='bg-black text-white font-bold hover:bg-[rgb(85,44,212)] p-2 rounded-md'
          onClick={() => requestdecision(friend._id, 'reject')}
        >
          Reject
        </button>
      </div>
    </div>
  ))
)}

      </div>
    </div>
  );
}

export default Notificationpage;
