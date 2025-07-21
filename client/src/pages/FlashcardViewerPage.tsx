import FlashcardViewer from "@/components/Flashcards/FlashcardViewer";
import NavigationButtons from "@/components/Flashcards/NavigationButtons";
import NavBar from "@/components/NavBar";
import { useParams, useSearchParams } from "react-router-dom"; 

//IF you have the flashcard objects already, what you can do is send the data to them but then how does the navigation work?

import { FlashcardsHomeRes } from "./FlashcardsHome";
import { useEffect, useState } from "react";

interface FlashcardViewerPageProps {

}

async function getFlashcards(deckId: number, type: string, setFlashcards: (flashcards: (FlashcardsHomeRes[] | null)) => void) {
    

    try {
        const res = await fetch(`http://localhost:3000/api/flashcards/${deckId}`, {
            method: "GET",
            credentials: "include"
        });

        const resData = await res.json();

        console.log(resData);

        let filteredData = resData;

        if (type === 'incorrect') {
            filteredData = filteredData.filter((flashcard: FlashcardsHomeRes) => flashcard.correct_check == false);
        }

        setFlashcards(filteredData);

    } catch (e) {
        console.error(`Some error occoured: ${e}`);
    }
}

export default function FlashcardViewerPage() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const deckId = Number(params.deckId);
    const type = searchParams.get('type') || 'all';
    const [flashcards, setFlashcards] = useState<FlashcardsHomeRes[] | null>(null);


    useEffect(() => {
        getFlashcards(deckId, type, setFlashcards);
    }, []);
    
    let firstFlashcard = null;
    if (flashcards) {
        firstFlashcard = flashcards[0];
    }
    

    return (
        <div className="w-full h-screen bg-gray-50 bg-opacity-25">
            <div className="flex justify-center items-center h-[calc(100vh-16rem)]" >
                {firstFlashcard &&  <FlashcardViewer id={firstFlashcard.flashcard_id} question={firstFlashcard.question} answer={firstFlashcard.answer} correctCheck={firstFlashcard.correct_check}/>}
            </div>
            <NavigationButtons className="fixed bottom-5 left-1/2 -translate-x-1/2"/>
        </div>
    );
}