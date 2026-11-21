import { faXmark, faChevronLeft, faChevronRight, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import profile1 from '../images/profile1.jpg';
import { getrequestservice } from '../Services/user/getrequest';
import { useNavigate } from 'react-router-dom';
import { requestservice } from "../Services/user/requestaction";
import { useSelector, useDispatch } from 'react-redux';
import { notification } from '../Redux/slices/loadingSlice';
import Navbar from '../Components/Navbar';

function Notificationpage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userimage = useSelector(state => state.profile.profileUrl);
  const friendrequest = useSelector(state => state.loader.requests || []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handlerequests = async () => {
    try {
      const res = await getrequestservice();
      if (res?.data?.requestFriends) {
        dispatch(notification(res.data.requestFriends));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const requestdecision = async (senderId, value) => {
    try {
      const res = await requestservice(senderId, value);
      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.status === 200) {
        const updatedRequests = friendrequest.filter(
          friend => friend._id !== senderId
        );
        dispatch(notification(updatedRequests));
      }
    } catch (error) {
      console.error("Request action failed:", error);
    }
  };

  useEffect(() => {
    handlerequests();
  }, []);

  return (
    <div className="bg-[rgba(27,32,38,255)] text-white text-sm min-h-screen md:flex">
      <div className="md:flex md:w-[100%]">
        {/* Sidebar Container */}
        <div className={`relative ${isSidebarExpanded ? "md:w-[20%]" : "md:w-[8%]"}`}>
          {/* <div
            className='hidden md:block absolute w-[18px] h-[34px] bg-[rgb(56,59,68)] cursor-pointer flex items-center justify-center rounded-tl-[7.5px] rounded-bl-[7.5px] right-0 top-16 text-white text-lg font-semi-bold z-20'
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronRight} />}
          </div> */}
          <Navbar isSidebarExpanded={isSidebarExpanded} setisSidebarExpanded={setIsSidebarExpanded} />
        </div>

        {/* Main Content Area */}
        <div className={`${isSidebarExpanded ? "md:w-[80%]" : "md:w-[92%]"} md:border-l-2 md:border-[rgb(85,95,94)] min-h-screen flex flex-col`}>
          {/* Header */}
          <div className="flex justify-between items-center py-4 px-6 bg-[rgba(56,59,68,255)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(41,45,54,255)] flex items-center justify-center">
                <FontAwesomeIcon icon={faBell} className="text-[rgba(192,52,48,255)] text-lg" />
              </div>
              <h2 className="font-bold text-xl text-white">Notifications</h2>
            </div>
            {/* Close / Cross Icon */}
            <div
              onClick={() => navigate("/check")}
              className="w-10 h-10 rounded-full bg-[rgba(41,45,54,255)] flex items-center justify-center cursor-pointer hover:bg-[rgba(192,52,48,255)] transition"
              title="Close and return to chats"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl text-white" />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 flex-1">
            {friendrequest.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-28 text-gray-400 gap-3">
                <div className="w-16 h-16 rounded-full bg-[rgba(41,45,54,255)] flex items-center justify-center">
                  <FontAwesomeIcon icon={faBell} className="text-2xl text-[rgba(192,52,48,255)] opacity-50" />
                </div>
                <p className="text-base font-medium">No notifications at the moment</p>
                <p className="text-xs text-gray-500">Incoming friend requests will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friendrequest.map((friend) => (
                  <div
                    key={friend._id}
                    className="bg-[rgba(41,45,54,255)] border border-[rgba(56,59,68,255)] rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-lg hover:border-gray-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.profileImage || profile1}
                        className="h-12 w-12 rounded-full object-cover border-2 border-[rgba(192,52,48,255)]"
                        alt={friend.username}
                      />
                      <div className="text-start">
                        <p className="text-white font-semibold text-base">{friend.username}</p>
                        <p className="text-gray-400 text-xs">Wants to connect with you</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-[rgba(56,59,68,255)]">
                      <button
                        className="flex-1 bg-[rgba(192,52,48,255)] hover:bg-[#a02a26] text-white font-semibold py-1.5 rounded-lg text-xs transition"
                        onClick={() => requestdecision(friend._id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        className="flex-1 bg-[rgba(56,59,68,255)] hover:bg-[rgba(70,74,85,255)] text-gray-300 font-semibold py-1.5 rounded-lg text-xs transition"
                        onClick={() => requestdecision(friend._id, 'reject')}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notificationpage;
