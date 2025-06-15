import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./LoginPage";
import Login from "../components/Login";
import Home from "./Home";
import Topic from "@/components/Topic";
import Signup from "@/components/Signup";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<LoginPage />} />
        <Route path="/signup" element= {<Signup />} /> 
        <Route path="/home" element= { <Home /> } />
        <Route path="/login" element= { <Login /> } />
        <Route path="/topic" element= {  <Topic name="Test Demo" desc="lorem ipsum solor dorem" createdAt={new Date()} id={1} /> } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
