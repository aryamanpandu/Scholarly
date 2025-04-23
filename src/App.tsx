import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./Signup"
import Login from "./Login";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Login />} />
        <Route path="/signup" element= {<Signup />} /> 
        <Route path="/login" element= {<Login />} /> 
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
