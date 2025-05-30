import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "../components/Signup"
// import LoginCard from "@/components/LoginCard";

import LoginPage from "./LoginPage";
import Login from "../components/Login";
import Home from "./Home";
import SignupTest from "@/components/SignupTest";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<LoginPage />} />
        <Route path="/signup" element= {<Signup />} /> 
        <Route path="/home" element= { <Home /> } />
        <Route path="/login" element= { <Login /> } />
        <Route path="/signuptest" element= { <SignupTest /> } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
