import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "../components/Signup"
// import LoginCard from "@/components/LoginCard";
import Login from "@/components/Login";
import LoginPage from "./LoginPage";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<LoginPage />} />
        <Route path="/signup" element= {<Signup />} /> 
        <Route path="/login" element= {<Login />} /> 
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
