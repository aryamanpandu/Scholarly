import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./LoginPage";
import Home from "./Home";
import SignUpPage from "./SignUpPage";
import DecksHome from "./DecksHome";
import Flashcard from "@/components/Flashcards/Flashcard";

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
        <Route path="/flashcard" element= { <Flashcard question="Hello guys" answer="test pls work" deckId={1} flashcardId={1} onRefresh={() => {}}/> } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
