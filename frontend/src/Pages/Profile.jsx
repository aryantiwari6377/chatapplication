

import React, { useEffect, useState } from 'react';
import profile from '../images/profile.jpg';
import { faArrowLeft, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { profileservice } from '../Services/user/profiledata';
import axios from 'axios';
import { logoutfun } from '../Services/auth/logout';
import { useSelector, useDispatch } from 'react-redux';
import { profileDetail, profileImage } from '../Redux/slices/profileSlice';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const userimage = useSelector(state => state.profile.profileUrl);
  const userDetail = useSelector(state => state.profile.user);

  // Local state for fallback UI
  const [loading, setLoading] = useState(!userDetail.name); // If no profile, show fallback

  const ProfileData = async () => {
    try {
      const response = await profileservice();
      console.log("res",response);
      dispatch(profileDetail(response.user)); // Store in Redux
      if (response.user.profileImage) {
        dispatch(profileImage(response.user.profileImage));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userDetail.name) {
      ProfileData();
    } else {
      setLoading(false); // Data already in Redux, no API call needed
    }
  }, [userDetail]);

  const logouthandle = async () => {
    const response = await logoutfun();
    if (response.status === 200) {
      navigate("/login");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,  
        },
      });

      const imageUrl = response.data.url;
      dispatch(profileImage(imageUrl));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="h-[100vh] overflow-hidden">
      <div className="mt-2 ml-2 flex flex-col bg-black rounded-full w-[32px] h-[32px] items-center justify-center lg:mt-10 lg:ml-12 lg:w-[34px] lg:h-[34px]">
        <FontAwesomeIcon icon={faArrowLeft} className="text-white text-xl font-bold lg:text-[24px]" onClick={() => { navigate(-1) }} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">Loading...</div>
      ) : (
        <div className="pt-4 px-16 lg:flex lg:mt-12">
          <div className="my-3 flex items-center justify-center lg:w-[50%] lg:justify-end lg:pr-32 lg:gap-x-3">
            <img src={userimage || profile} className="w-[120px] h-[120px] rounded-full lg:w-[180px] lg:h-[180px]" alt="profile" />
            <div>
              <FontAwesomeIcon icon={faPen} onClick={() => document.getElementById('profileImageInput').click()} />
              <input
                type="file"
                id="profileImageInput"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="pt-4 md:mx-32 lg:mx-0">
            <div className="flex flex-col gap-y-6">
              <div className="text-start flex flex-col gap-y-1">
                <label className="text-gray-600 font-bold">Name</label>
                <p className="text-font pl-3 font-bold">{userDetail.name}</p>
              </div>
              <div className="text-start flex flex-col gap-y-1">
                <label className="text-gray-600 font-bold">Email</label>
                <p className="text-font pl-3 font-bold">{userDetail.email}</p>
              </div>
              <div className="text-start flex justify-between gap-y-1">
                <label className="text-gray-600 font-bold">Connections </label>
                <p className="bg-blue-400 rounded-full w-[30px] h-[30px] text-white font-bold text-center">{userDetail.connection}</p>
              </div>
            </div>

            <div className="flex flex-col my-6 items-center">
              <button className="bg-black text-white rounded-full font-bold w-[180px] py-2" onClick={() => { navigate('/forgotpassword') }}>Change password</button>
              <button className="p-2 text-red-300 font-bold" onClick={logouthandle}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

