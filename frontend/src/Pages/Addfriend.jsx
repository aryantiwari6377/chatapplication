import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { addfriendservice } from '../../src/Services/user/addfriend';
import addfriend from '../../src/images/addfriend.jpg';

const Addfriend = ({ addpage, addfriendclose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  if (!addpage) return null;

  const handleClose = () => {
    setEmail("");
    setMessage({ type: '', text: '' });
    addfriendclose();
  };

  const handlefriend = async (e) => {
    e.preventDefault(); 
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const res = await addfriendservice(email);
      if (res.status === 200) {
        setMessage({ type: 'success', text: res.data?.message || 'Friend request sent successfully!' });
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setMessage({ type: 'error', text: error.response.data?.message || 'User does not exist with this email.' });
        } else {
          setMessage({ type: 'error', text: error.response.data?.message || 'Failed to send friend request.' });
        }
      } else {
        setMessage({ type: 'error', text: 'Network error, please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 px-6 z-50 flex items-center justify-center bg-black/60">
      <div className="font-bold bg-[rgb(132,196,203)] min-h-[290px] mx-auto rounded-[16px] w-[280px] sm:w-[40%] pt-3 pb-4 lg:w-[400px]">
        
        <div className="text-end mr-4">
          <FontAwesomeIcon 
            icon={faXmark} 
            className="font-bold text-xl cursor-pointer text-gray-800 hover:text-black" 
            onClick={handleClose} 
          />
        </div>
        <img src={addfriend} className='h-[90px] w-auto mx-auto object-contain' alt="Add friend" />
        
        <form className="flex flex-col pt-4 px-4" onSubmit={handlefriend}>
          <input 
            type="email" 
            placeholder="Enter email" 
            value={email}
            className="outline-none rounded-full text-black px-3 h-[32px] w-full max-w-[260px] mx-auto text-sm" 
            onChange={(e) => {
              setEmail(e.target.value);
              if (message.text) setMessage({ type: '', text: '' });
            }} 
            required 
          />

          {message.text && (
            <p className={`text-xs text-center mt-2 px-2 font-semibold ${
              message.type === 'error' ? 'text-red-700' : 'text-green-800'
            }`}>
              {message.text}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#566696] hover:bg-[#43527a] text-white w-[130px] rounded-md py-1.5 my-3 mx-auto text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addfriend;
