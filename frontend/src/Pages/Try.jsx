

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Components/Navbar';
import Addfriend from './Addfriend';
import { friendlistservice } from '../Services/user/friendlist';
import { latestmessageservice } from '../Services/user/latestmessage';
import profile from '../images/profile.jpg';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import vector75left from '../images/Vector75left.svg';
import vector75right from '../images/Vector 75right.svg';
import { loadingHandle ,friendList} from '../Redux/slices/loadingSlice';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


const Try = () => {
  const [addpage, setAddpage] = useState(false);
  const [friendslist, setFriendslist] = useState([]);
  const fri = useRef([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [friendMessages, setFriendMessages] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchfound, setsearchfound] = useState(false);
 // const [loading, setLoading] = useState(true);
  const zero = useRef(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();

   const [isSidebarExpanded, setisSidebarExpanded] = useState(false);
 
  const userimage = useSelector(state => state.profile.profileUrl);
   
  const friendsList =  useSelector(state => state.loader.friends);
  console.log("list",friendsList);

  const loading = useSelector(state => state.loader.loading);
  console.log("load is",loading);

  const addfriendclose = () => {
    setAddpage(!addpage);
  };

  const toggleSidebar = () =>{
    setisSidebarExpanded(!isSidebarExpanded);
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    return time;
  };
   
  // const friendlist = async () => {
  //   try {
  //     const res = await friendlistservice();

  //     if (res.status === 401) {
  //       navigate('/login');
  //     }
  //     const { data } = res;

  //     if (data?.activeFriends && Array.isArray(data.activeFriends)  ) {
  //       if (JSON.stringify(friendsList) !== JSON.stringify(data.activeFriends)) {
  //         setFriendslist(data.activeFriends);
  //         setFilteredFriends(data.activeFriends);
  //         dispatch(friendList(data.activeFriends)); // Only update Redux if data is different
  //       }
       
  //       console.log("length",friendsList.length);
  //       console.log("check",friendsList);
        
        
  //       dispatch(loadingHandle(false));
  //     }
     
  //     else{
       
  //         zero.current = true;
  //        console.log("zero run");
  //     }
  //    }catch (error) {
  //     console.error('Error fetching friend list:', error);
  //     dispatch(loadingHandle(true));
  //   //  setLoading(true);
  //   }
  // };

  const friendlist = async () => {
    try {
     if(friendsList.length === 0){ dispatch(loadingHandle(true)); }// Start loading before fetching
  
      const res = await friendlistservice();
      
      if (res.status === 401) {
        navigate('/login');
      }
      
      const { data } = res;
      if (data?.activeFriends && Array.isArray(data.activeFriends)) {
        if (data.activeFriends.length === 0) {
          zero.current = true; // No friends available
        } else {
          zero.current = false; // Friends exist
          setFriendslist(data.activeFriends);
          setFilteredFriends(data.activeFriends);
          dispatch(friendList(data.activeFriends));
        }
      } else {
        zero.current = true; // Ensure zero is set when there's no valid data
      }
  
    } catch (error) {
      console.error('Error fetching friend list:', error);
    } finally {
      dispatch(loadingHandle(false)); // Ensure loading stops after everything
    }
  };

  
  const frienddetail = async (friendid) => {
    try {
      const res = await latestmessageservice(friendid);
      if (res.status === 204) {
        setFriendMessages((prevMessages) => [
          ...prevMessages,
          { friendId: friendid, message: 'Be first', timestamp: 'no' },
        ]);
      } else {
        const latestMessage = res.data;
        setFriendMessages((prevMessages) => [
          ...prevMessages,
          {
            friendId: friendid,
            message: latestMessage.content,
            timestamp: latestMessage.timestamp,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching latest message:', error);
    }
  };

  const searchHandler = (e) => {
    const searchValue = e.target.value;
    setSearchName(searchValue);

    if (searchValue.trim() === '') {
      setFilteredFriends(friendslist);
      setsearchfound(false);
    } else {
      const filtered = friendslist.filter((friend) =>
        friend.username.toLowerCase().includes(searchValue.toLowerCase())
      );

      setFilteredFriends(filtered);
      setsearchfound(filtered.length > 0);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      await friendlist();
    };
  
    fetchdata();
  }, []);
  

  useEffect(() => {
    if (friendsList.length > 0) {
      friendsList.forEach((friend) => {
        frienddetail(friend._id);
      });
    }
  }, [friendsList]);

  return (
    <div className="bg-[rgba(27,32,38,255)] text-white text-sm min-h-[100vh] md:flex">
      <div className="md:flex md:w-[100%]">

        <div className={`relative ${isSidebarExpanded ? "md:w-[20%]" : "md:w-[8%]"}`}>

<div className='hidden md:block absolute w-[18px] h-[34px] bg-[rgb(56,59,68)] cursor-pointer flex items-center justify-center rounded-tl-[7.5px] rounded-bl-[7.5px] right-0 top-16 text-white text-lg font-semi-bold' onClick={() => toggleSidebar()}> {isSidebarExpanded ? <FontAwesomeIcon icon={faChevronLeft} />
 : <FontAwesomeIcon icon={faChevronRight} />
}</div>

          <Navbar isSidebarExpanded={isSidebarExpanded} setisSidebarExpanded={setisSidebarExpanded}/>
        </div>
        
        <div className={`${isSidebarExpanded ? "md:w-[80%]" : "md:w-[92%]"}   md:border-l-2 md:border-[rgb(85,95,94)]`}>
          <div className="flex flex-col gap-y-2 py-3 px-4">
            <div className="flex justify-between pt-4">
              <div className="flex gap-x-3">
                <img
                  src={ userimage ||profile}
                  className="rounded-full h-[40px] w-[40px] cursor-pointer"
                  alt="Profile"
                  onClick={() => {
                    navigate('/profile');
                  }}
                />
                <p className="text-white text-xl font-bold text-center">
                  Chats
                </p>
              </div>
              <div className="bg-[rgba(192,52,48,255)] w-[30px] h-[30px] rounded-full pt-1">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-xl font-bold  cursor-pointer"
                  onClick={addfriendclose}
                />
              </div>
            </div>
            <div className='lg:text-start'>
              <input
                type="text"
                placeholder="Search"
                value={searchName}
                onChange={searchHandler}
                className="bg-[rgba(41,45,54,255)] outline-none rounded-full placeholder-white-500 font-bold px-4 h-8 w-full lg:w-[300px]"
              />
            </div>
          </div>
  
          <div className="flex flex-col gap-y-6 mt-6 px-4">
            { loading ? (
              // Loading Skeleton
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : zero.current ? ( <div className='pt-[90px] flex flex-col items-center justify-center'><p>No Friends</p> <button 
              type="submit" 
              className="bg-[#566696] w-[100px] rounded-md py-1 my-3 mx-auto font-bold lg:mt-6 lg:h-[40px] lg:py-2 lg:w-[120px]"
           onClick={addfriendclose} >Add</button></div> ) : searchfound ? (
              // Filtered friends
              filteredFriends.map((friend) => {
                const friendMessage = friendMessages.find(
                  (msg) => msg.friendId === friend._id
                );
                
                 
                const formattedTime =
                  friendMessage?.timestamp && friendMessage.timestamp !== 'no'
                    ? formatTimestamp(friendMessage.timestamp)
                    : '00:00';
        
                return (
                  <div
                    key={friend._id}
                    className="flex justify-between"
                    onClick={() => {
                      navigate(`/chatchat/${friend._id}`);
                    }}
                  >
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
                        <p>
                          {friendMessage ? friendMessage.message : 'No messages'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p>{formattedTime}</p>
                    </div>
                  </div>
                );
              })
            ) : (  
              // All friends list
              friendsList.map((friend) => {
                const friendMessage = friendMessages.find(
                  (msg) => msg.friendId === friend._id
                );

                const formattedTime =
                  friendMessage?.timestamp && friendMessage.timestamp !== 'no'
                    ? formatTimestamp(friendMessage.timestamp)
                    : '00:00';
 
                return (
                  <div
                    key={friend._id}
                    className="flex justify-between  cursor-pointer"
                    onClick={() => {
                      navigate(`/chatchat/${friend._id}`);
                    }}
                  >
                    <div className="flex gap-x-12">
                      <div>
                        <img
                          src={friend.profileImage || profile}
                          className="rounded-full h-[50px] w-[50px]"
                          alt={`${friend.username}'s profile`}
                        />
                      </div>
                      <div className="text-start">
                        <p className="text-[16px]">{friend.username}</p>
                        <p>
                          {friendMessage ? friendMessage.message : 'No messages'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p>{formattedTime}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Addfriend addpage={addpage} addfriendclose={addfriendclose} />
    </div>
  );
};

export default Try;
