// import logo from './logo.svg';
// import './App.css';
// import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
// import Login from "../src/Pages/Login";
// import Signup from "../src/Pages/Signup";
// import Addfriend from "../src/Pages/Addfriend";
// import Chatpage from "../src/Pages/Backup_Chatpage";
// import Chatuserpage from "../src/Pages/Backup_Chatuserpage";
// import Forgotpage from "../src/Pages/Forgotpage";
// import Startingpage from "../src/Pages/Startingpage";
// import Notificationpage from "../src/Pages/Notificationpage";
// import Profile from './Pages/Profile';
// import Try from './Pages/Try';
// import TryChat from './Pages/TryChat';
// import forgotpage from '../src/Pages/Forgotpage';
// import Passwordresetpage from './Pages/Passwordresetpage';
// import Nodata from './Pages/Nodata';
// import Settingpage from './Pages/Settingpage';

// function App() {
//   return (
//     <div className="App w-full 2xl:w-[1200px] 2xl:mx-auto">
//       <Routes>
             
//             <Route path="/" element={<Startingpage/>}/>
//             <Route path="/login" element={<Login/>}/>
//             <Route path="/addfriend" element={<Addfriend/>}/>
//             <Route path="/signup" element={<Signup/>}/>
//             <Route path="/chatuserpage" element={<Chatuserpage/>}/>
//             <Route path="/chatpage/:id" element={<Chatpage/>}/>
//             <Route path="/forgotpage" element={<Forgotpage/>}/>
//             <Route path="/startpage" element={<Startingpage/>}/>
//             <Route path="/notification" element={<Notificationpage/>}/>
//             <Route path="/profile" element={<Profile/>}/>
//             <Route path="/check" element={<Try/>}/>
//             <Route path="/chatchat/:id" element={<TryChat/>}/>
//             <Route path="/startingpage" element={<Startingpage/>}/>
//             <Route path="/forgotpassword" element={<Forgotpage/>}/>
//             <Route path="/reset-password/:token" element={<Passwordresetpage/>}/>
//             <Route path="/nodata" element={<Nodata/>}/>
//             <Route path="/setting" element={<Settingpage/>}/>
//             </Routes>
//     </div>
//   );
// }

// export default App;
import { useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from '../src/Pages/Login';
import Signup from '../src/Pages/Signup';
import Addfriend from '../src/Pages/Addfriend';
import Chatpage from '../src/Pages/Backup_Chatpage';
import Chatuserpage from '../src/Pages/Backup_Chatuserpage';
import Forgotpage from '../src/Pages/Forgotpage';
import Startingpage from '../src/Pages/Startingpage';
import Notificationpage from '../src/Pages/Notificationpage';
import Profile from './Pages/Profile';
import Try from './Pages/Try';
import TryChat from './Pages/TryChat';
import Passwordresetpage from './Pages/Passwordresetpage';
import Nodata from './Pages/Nodata';
import Settingpage from './Pages/Settingpage';

// Blocks already-logged-in users from visiting /login or /signup
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/check" replace />;
  }
  return children;
}

// Blocks unauthenticated users from private pages
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && e.newValue) {
        navigate('/check', { replace: true });
      }
      if (e.key === 'token' && !e.newValue) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  return (
    <div className="App w-full 2xl:w-[1200px] 2xl:mx-auto">
      <Routes>
        {/* Public / Auth Routes */}
        <Route path="/" element={<Startingpage />} />
        <Route path="/startpage" element={<Startingpage />} />
        <Route path="/startingpage" element={<Startingpage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route path="/forgotpage" element={<Forgotpage />} />
        <Route path="/forgotpassword" element={<Forgotpage />} />
        <Route path="/reset-password/:token" element={<Passwordresetpage />} />

        {/* Protected App Routes */}
        <Route path="/addfriend" element={<ProtectedRoute><Addfriend /></ProtectedRoute>} />
        <Route path="/chatuserpage" element={<ProtectedRoute><Chatuserpage /></ProtectedRoute>} />
        <Route path="/chatpage/:id" element={<ProtectedRoute><Chatpage /></ProtectedRoute>} />
        <Route path="/notification" element={<ProtectedRoute><Notificationpage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/check" element={<ProtectedRoute><Try /></ProtectedRoute>} />
        <Route path="/chatchat/:id" element={<ProtectedRoute><TryChat /></ProtectedRoute>} />
        <Route path="/nodata" element={<ProtectedRoute><Nodata /></ProtectedRoute>} />
        <Route path="/setting" element={<ProtectedRoute><Settingpage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;