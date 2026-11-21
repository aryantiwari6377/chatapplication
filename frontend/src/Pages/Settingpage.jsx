import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faArrowLeft,
  faGear,
  faKey,
  faShieldHalved,
  faBell,
  faRightFromBracket,
  faVolumeHigh,
  faTrashCan,
  faUser,
  faPen,
  faCircleCheck,
  faPlay,
  faStop
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { logoutfun } from '../Services/auth/logout';
import { profileservice } from '../Services/user/profiledata';
import Navbar from '../Components/Navbar';
import profile from '../images/profile.jpg';

function Settingpage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // Functional setting states backed by localStorage
  const [callRingtone, setCallRingtone] = useState(() => localStorage.getItem('setting_call_ringtone') !== 'false');
  const [ringbackTone, setRingbackTone] = useState(() => localStorage.getItem('setting_ringback_tone') !== 'false');
  const [msgAudio, setMsgAudio] = useState(() => localStorage.getItem('setting_msg_audio') !== 'false');

  // User profile state
  const [userData, setUserData] = useState(null);
  const [statusFeedback, setStatusFeedback] = useState('');
  const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await profileservice();
        if (res?.user) {
          setUserData(res.user);
        }
      } catch (err) {
        console.error("Error fetching settings user profile:", err);
      }
    };
    fetchUser();
  }, []);

  const showToast = (msg) => {
    setStatusFeedback(msg);
    setTimeout(() => setStatusFeedback(''), 3000);
  };

  const handleToggleCallRingtone = (checked) => {
    setCallRingtone(checked);
    localStorage.setItem('setting_call_ringtone', checked ? 'true' : 'false');
    showToast(`Incoming call ringtone ${checked ? 'enabled' : 'muted'}`);
  };

  const handleToggleRingbackTone = (checked) => {
    setRingbackTone(checked);
    localStorage.setItem('setting_ringback_tone', checked ? 'true' : 'false');
    showToast(`Outgoing ringback tone ${checked ? 'enabled' : 'muted'}`);
  };

  const handleToggleMsgAudio = (checked) => {
    setMsgAudio(checked);
    localStorage.setItem('setting_msg_audio', checked ? 'true' : 'false');
    showToast(`Message audio effects ${checked ? 'enabled' : 'disabled'}`);
  };

  // Play a live synthesized tone burst using browser Web Audio API
  const playTestTone = () => {
    if (isPlayingTestSound) return;
    try {
      setIsPlayingTestSound(true);
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
      setTimeout(() => setIsPlayingTestSound(false), 700);
    } catch {
      setIsPlayingTestSound(false);
    }
  };

  // Clear call history stored in localStorage
  const handleClearCallHistory = () => {
    let clearedCount = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('callHistory_')) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    showToast(clearedCount > 0 ? "Call history cleared successfully!" : "Call history is already empty.");
  };

  const handleLogout = async () => {
    try {
      await logoutfun();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshtoken');
      localStorage.removeItem('senderId');
      navigate('/login');
    }
  };

  return (
    <div className="bg-[rgba(27,32,38,255)] text-white text-sm min-h-screen md:flex">
      <div className="md:flex md:w-[100%]">
        {/* ── Sidebar Container ── */}
        <div className={`relative ${isSidebarExpanded ? "md:w-[220px]" : "md:w-[72px]"} flex-shrink-0 transition-all duration-200`}>
          <Navbar isSidebarExpanded={isSidebarExpanded} setisSidebarExpanded={setIsSidebarExpanded} />
        </div>

        {/* ── Main Content Area ── */}
        <div className="flex-1 min-w-0 md:border-l-2 md:border-[rgb(85,95,94)] min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center py-4 px-6 bg-[rgba(56,59,68,255)] border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate('/check')}
                className="w-9 h-9 rounded-full bg-[rgba(41,45,54,255)] flex items-center justify-center cursor-pointer hover:bg-[rgba(192,52,48,255)] transition"
                title="Return to chats"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-white text-base" />
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGear} className="text-[rgba(192,52,48,255)] text-lg" />
                <h2 className="font-bold text-xl text-white">Settings</h2>
              </div>
            </div>

            {/* Status Feedback Toast */}
            {statusFeedback && (
              <div className="bg-green-600/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-fadeIn">
                <FontAwesomeIcon icon={faCircleCheck} />
                <span>{statusFeedback}</span>
              </div>
            )}
          </div>

          {/* Settings Body */}
          <div className="p-6 max-w-2xl w-full mx-auto min-[1400px]:mx-0 min-[1400px]:ml-[18%] flex flex-col gap-6">
            {/* ── SECTION 1: User Profile Card ── */}
            <div className="bg-[rgba(41,45,54,255)] border border-[rgba(56,59,68,255)] rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={userData?.profileImage || profile}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[rgba(192,52,48,255)] shadow-md"
                  />
                  <div>
                    <h3 className="text-white font-bold text-lg">{userData?.username || 'User Profile'}</h3>
                    <p className="text-gray-400 text-xs">{userData?.email || 'Logged in'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded-full">
                      ● Active Session
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-1.5 bg-[rgb(56,59,68)] hover:bg-[rgba(192,52,48,255)] text-white text-xs font-semibold px-3 py-2 rounded-full transition shadow"
                  title="Edit profile photo and details"
                >
                  <FontAwesomeIcon icon={faPen} className="text-[11px]" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* ── SECTION 2: Notification & Audio Settings (100% Functional) ── */}
            <div className="bg-[rgba(41,45,54,255)] border border-[rgba(56,59,68,255)] rounded-2xl p-5 shadow-lg">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowNotification(!showNotification)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(56,59,68,255)] flex items-center justify-center text-[rgba(192,52,48,255)]">
                    <FontAwesomeIcon icon={faBell} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-base">Notification & Sound Effects</p>
                    <p className="text-xs text-gray-400">Configure real-time ringtones, chimes & sound alerts</p>
                  </div>
                </div>
                <FontAwesomeIcon icon={showNotification ? faChevronUp : faChevronDown} className="text-gray-400 text-sm" />
              </div>

              {showNotification && (
                <div className="mt-5 pt-4 border-t border-[rgba(56,59,68,255)] flex flex-col gap-4 text-sm">
                  {/* Incoming Call Ringtone */}
                  <div className="flex items-center justify-between py-1">
                    <div className="pr-4">
                      <p className="font-medium text-white">Incoming Call Ringtone</p>
                      <p className="text-xs text-gray-400">Play telephone chime when receiving video/audio calls</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={callRingtone}
                        onChange={(e) => handleToggleCallRingtone(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(192,52,48,255)]"></div>
                    </label>
                  </div>

                  {/* Outgoing Ringback Tone */}
                  <div className="flex items-center justify-between py-1">
                    <div className="pr-4">
                      <p className="font-medium text-white">Outgoing Ringback Tone</p>
                      <p className="text-xs text-gray-400">Hear European 425Hz pulsing tone while calling a friend</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ringbackTone}
                        onChange={(e) => handleToggleRingbackTone(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(192,52,48,255)]"></div>
                    </label>
                  </div>

                  {/* Message Audio Effects */}
                  <div className="flex items-center justify-between py-1">
                    <div className="pr-4">
                      <p className="font-medium text-white">Message Voice Preview</p>
                      <p className="text-xs text-gray-400">Enable audio waveform player controls in chat bubbles</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={msgAudio}
                        onChange={(e) => handleToggleMsgAudio(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(192,52,48,255)]"></div>
                    </label>
                  </div>

                  {/* Test Sound Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={playTestTone}
                      disabled={isPlayingTestSound}
                      className="flex items-center gap-2 bg-[rgba(56,59,68,255)] hover:bg-[rgba(70,74,85,255)] text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      <FontAwesomeIcon icon={isPlayingTestSound ? faStop : faPlay} className="text-[rgba(192,52,48,255)]" />
                      <span>{isPlayingTestSound ? 'Playing Tone...' : 'Test Synthesizer Ringtone'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 3: Privacy & Data Management (100% Functional) ── */}
            <div className="bg-[rgba(41,45,54,255)] border border-[rgba(56,59,68,255)] rounded-2xl p-5 shadow-lg">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPrivacy(!showPrivacy)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(56,59,68,255)] flex items-center justify-center text-[rgba(192,52,48,255)]">
                    <FontAwesomeIcon icon={faShieldHalved} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-base">Privacy & Call History</p>
                    <p className="text-xs text-gray-400">Clear stored logs and manage conversation privacy</p>
                  </div>
                </div>
                <FontAwesomeIcon icon={showPrivacy ? faChevronUp : faChevronDown} className="text-gray-400 text-sm" />
              </div>

              {showPrivacy && (
                <div className="mt-5 pt-4 border-t border-[rgba(56,59,68,255)] flex flex-col gap-4 text-sm">
                  {/* Clear Call Logs */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="font-medium text-white">Call History Storage</p>
                      <p className="text-xs text-gray-400">Permanently clear all incoming, outgoing and missed call logs</p>
                    </div>
                    <button
                      onClick={handleClearCallHistory}
                      className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                      <span>Clear Logs</span>
                    </button>
                  </div>

                  {/* 2FA Status */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-gray-400">Account security powered by email OTP verification</p>
                    </div>
                    <span className="text-green-400 text-xs font-semibold bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                      Enabled
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 4: Account Security & Logout ── */}
            <div className="bg-[rgba(41,45,54,255)] border border-[rgba(56,59,68,255)] rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <div
                className="flex items-center justify-between cursor-pointer py-1"
                onClick={() => navigate('/forgotpassword')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(56,59,68,255)] flex items-center justify-center text-[rgba(192,52,48,255)]">
                    <FontAwesomeIcon icon={faKey} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Change Password</p>
                    <p className="text-xs text-gray-400">Send password reset link to your email</p>
                  </div>
                </div>
                <span className="text-xs bg-[rgb(56,59,68)] px-3 py-1.5 rounded-full hover:bg-[rgba(192,52,48,255)] transition">
                  Change →
                </span>
              </div>

              <div className="pt-3 border-t border-[rgba(56,59,68,255)] flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Session Management</p>
                  <p className="text-xs text-gray-400">Log out of this browser across all active tabs</p>
                </div>
                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settingpage;
