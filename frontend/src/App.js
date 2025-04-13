import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "../src/Pages/Login";
import Signup from "../src/Pages/Signup";
import Addfriend from "../src/Pages/Addfriend";
import Chatpage from "../src/Pages/Backup_Chatpage";
import Chatuserpage from "../src/Pages/Backup_Chatuserpage";
import Forgotpage from "../src/Pages/Forgotpage";
import Startingpage from "../src/Pages/Startingpage";
import Notificationpage from "../src/Pages/Notificationpage";
import Profile from './Pages/Profile';
import Try from './Pages/Try';
import TryChat from './Pages/TryChat';
import forgotpage from '../src/Pages/Forgotpage';
import Passwordresetpage from './Pages/Passwordresetpage';
import Nodata from './Pages/Nodata';
import Settingpage from './Pages/Settingpage';

function App() {
  return (
    <div className="App w-full 2xl:w-[1200px] 2xl:mx-auto">
      <Routes>
             
            <Route path="/" element={<Startingpage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/addfriend" element={<Addfriend/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/chatuserpage" element={<Chatuserpage/>}/>
            <Route path="/chatpage/:id" element={<Chatpage/>}/>
            <Route path="/forgotpage" element={<Forgotpage/>}/>
            <Route path="/startpage" element={<Startingpage/>}/>
            <Route path="/notification" element={<Notificationpage/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/check" element={<Try/>}/>
            <Route path="/chatchat/:id" element={<TryChat/>}/>
            <Route path="/startingpage" element={<Startingpage/>}/>
            <Route path="/forgotpassword" element={<Forgotpage/>}/>
            <Route path="/reset-password/:token" element={<Passwordresetpage/>}/>
            <Route path="/nodata" element={<Nodata/>}/>
            <Route path="/setting" element={<Settingpage/>}/>
            </Routes>
    </div>
  );
}

export default App;
