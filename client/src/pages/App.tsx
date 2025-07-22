import { Routes, Route, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "@/pages/App.css";
import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
import SignUpPage from "@/pages/SignUpPage";
import DecksHome from "@/pages/DecksHome";
import FlashcardsHome from "@/pages/FlashcardsHome";

import NavBar from "@/components/NavBar";
import FlashcardViewerPage from "@/pages/FlashcardViewerPage";

import { Toaster } from "sonner";


function AnimatedRoutes() {
  const location = useLocation();

  return(
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/login"
          element={
            <PageWrapper>
              <LoginPage/>
            </PageWrapper>
          }
        />

        <Route 
          path="/signup"
          element={
            <PageWrapper>
              <SignUpPage/>
            </PageWrapper>
          }
        />

        <Route 
          path="/home"
          element={
            <PageWrapper>
              <Home/>
            </PageWrapper>
          }
        />

        <Route 
          path="/deckHome/:topicId"
          element={
            <PageWrapper>
              <DecksHome/>
            </PageWrapper>
          }
        />

        <Route 
          path="/flashcardHome/:deckId"
          element={
            <PageWrapper>
              <FlashcardsHome/>
            </PageWrapper>
          }
        />

        <Route 
          path="/flashcardViewer/:deckId"
          element={
            <PageWrapper>
              <FlashcardViewerPage/>
            </PageWrapper>
          } 
        />
      </Routes>
    </AnimatePresence>
  )
}

function PageWrapper({children}: {children: ReactNode}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0}}
      transition={{ 
        duration: 0.17, 
        ease: "easeInOut" 
      }}
    >
      {children}
    </motion.div>
  );
 }

function App() {
  const location = useLocation();

  const hideNavBar = ["/login", "/signup"].includes(location.pathname);
  return (
    <div>
      <Toaster expand={true} position='bottom-center' richColors/>
      {!hideNavBar && <NavBar />}
      <AnimatedRoutes />

    </div>
  );
}

export default App;
