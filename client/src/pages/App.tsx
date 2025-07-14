import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/pages/App.css";
import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
import SignUpPage from "@/pages/SignUpPage";
import DecksHome from "@/pages/DecksHome";
import Flashcard from "@/components/Flashcards/Flashcard";
import FlashcardsHome from "@/pages/FlashcardsHome";

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
        <Route path="/flashcardHome/:deckId" element= { <FlashcardsHome /> } />
        <Route path="/flashcard" element= { <Flashcard question="Hello guys" answer="test pls work" deckId={1} flashcardId={1} onRefresh={() => {}}/> } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
