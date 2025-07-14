import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/pages/App.css";
import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
import SignUpPage from "@/pages/SignUpPage";
import DecksHome from "@/pages/DecksHome";
import FlashcardsHome from "@/pages/FlashcardsHome";

import FlashcardNavBar from "@/components/Flashcards/FlashcardNavBar";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<LoginPage />} />
        <Route path="/signup" element= {<SignUpPage />} /> 
        <Route path="/home" element= { <Home /> } />
        <Route path="/login" element= { <LoginPage /> } />
        <Route path="/deckHome/:topicId" element= { <DecksHome /> } />
        <Route path="/flashcardHome/:deckId" element= { <FlashcardsHome /> } />
        <Route path="/flashNav" element= {<FlashcardNavBar />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
