import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./LoginPage";
import Home from "./Home";
import SignUpPage from "./SignUpPage";
import DecksHome from "./DecksHome";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<LoginPage />} />
        <Route path="/signup" element= {<SignUpPage />} /> 
        <Route path="/home" element= { <Home /> } />
        <Route path="/login" element= { <LoginPage /> } />
        {/* <Route path="/deck" element= { <Deck id={1} topicId={2}createdAt={new Date()} name="test" desc="hello" /> } /> */}
        <Route path="/deckHome/:topicId" element= { <DecksHome /> } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
