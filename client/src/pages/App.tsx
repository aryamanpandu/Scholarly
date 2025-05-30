import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "../components/Signup"
// import LoginCard from "@/components/LoginCard";

import LoginPage from "./LoginPage";
import Login from "../components/Login";
import Home from "./Home";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<LoginPage />} />
        <Route path="/signup" element= {<Signup />} /> 
        <Route path="/home" element= { <Home /> } />
        <Route path="/login" element= { <Login /> } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
