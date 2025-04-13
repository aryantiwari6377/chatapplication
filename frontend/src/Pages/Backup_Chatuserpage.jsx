
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Components/Navbar';
import Chatpage from './Backup_Chatpage';
import Addfriend from './Addfriend';
import { friendlistservice } from '../Services/user/friendlist';
import profile from '../images/profile.jpg';
// Import AxiosResponse from axios
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';


const Backup_Chatuserspage = () => {
  const [addpage, setAddpage] = useState(false);
  const [friendslist, setFriendslist] = useState([]);
  const navigate = useNavigate();

  const addfriendclose = () => {
    setAddpage(!addpage);
  };

  const friendlist = async () => {
    try {

      const res = await friendlistservice();

     
      const { data } = res;

      // console.log('API response:', data);

      if (data?.activeFriends && Array.isArray(data.activeFriends)) {
        setFriendslist(data.activeFriends); 
        
  console.log(friendslist);
      } else {
        console.error('Response structure is not as expected:', data);
      }
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };


  useEffect(() => {
    friendlist();
  }, []);

  return (
    <div className="bg-[rgba(27,32,38,255)] text-white text-sm min-h-[100vh] md:flex">
      <div className="md:w-[50%]">
        <div className="hidden md:block">
          <Navbar />
        </div>
          
        <div className="bg-[rgba(56,59,68,255)] flex flex-col gap-y-2 py-3 px-4">
          <div className="flex justify-between pt-4">
            <div className="flex gap-x-3">
              <img src={profile} className="rounded-full h-[40px] w-[40px]" alt="Profile" />
              <p className="text-white text-xl font-bold text-center">Chats</p>
            </div>
            <div className="bg-[rgba(192,52,48,255)] w-[30px] h-[30px] rounded-full pt-1">
              <FontAwesomeIcon icon={faPlus} className="text-xl font-bold" onClick={addfriendclose} />
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="search" 
              className="bg-[rgba(41,45,54,255)] outline-none rounded-full placeholder-white-500 font-bold px-4 h-8 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-6 mt-6 px-4">
          {friendslist.length === 0 ? (
            <p>No friends found</p>
          ) : (
            friendslist.map((friend) => (
              <div key={friend._id} className="flex justify-between" onClick={()=>{navigate(`/chatpage/${friend._id}`)}} >
                <div className="flex gap-x-12">
                  <div>
                    <img
                      src={profile}
                      className="rounded-full h-[50px] w-[50px]"
                      alt={`${friend.username}'s profile`}
                    />
                  </div>
                  <div className="text-start">
                    <p className="text-[16px]">{friend.username}</p> 
                    <p>hi</p>
                  </div>
                </div>
                <div>
                  <p>10.15</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Addfriend addpage={addpage} addfriendclose={addfriendclose} />
      <div className="md:hidden">
        <Navbar />
      </div>
      <div className="w-[50%]">
        <div className="hidden md:block">
          <Chatpage />
        </div>
      </div>
    </div>
  );
};

export default  Backup_Chatuserspage;
