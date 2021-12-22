import React, { useState, useMemo } from "react";
import Home from './components/Home';
import About from './components/About';
import Settings from './components/Settings';
import Texts from './components/Texts';
import Words from './components/Words';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import { UserContext } from "./contexts/UserContext";
import {
  BrowserRouter as Router,
  Route, Routes,
} from 'react-router-dom';
import './App.css';

function App() {
  const [text, setText]: [text: null | Text, setText: Function] = useState(null);
  const openText = function(_event: Event, text: Text) {
    console.log(text);
    setText(text)
  }
  const [user, setUser] = useState(null)
  const providerValue = useMemo(() => ({user, setUser}), [user, setUser]);

  return (
    <Router>
      <div className="app">
        <UserContext.Provider value={providerValue}> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/texts" element={<Texts openText={openText}/>} />
          <Route path="/words" element={<Words />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/logout" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
        </ UserContext.Provider>
        {/* {loggedIn ?} */}
      </div>
    </Router>
  );
}

export default App;
