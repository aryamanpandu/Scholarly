import FlashcardViewer from "@/components/Flashcards/FlashcardViewer";
import NavigationButtons from "@/components/Flashcards/NavigationButtons";
import NavBar from "@/components/NavBar";
import { useParams, useSearchParams } from "react-router-dom"; 

//IF you have the flashcard objects already, what you can do is send the data to them but then how does the navigation work?

import { FlashcardsHomeRes } from "./FlashcardsHome";
import { useEffect, useState } from "react";

interface FlashcardViewerPageProps {
    id: number,
    question: string,
    answer: string,
    correctCheck: boolean,
    idx: number
}

async function getFlashcards(deckId: number, type: string, setFlashcards: (flashcards: (FlashcardViewerPageProps[] | null)) => void) {
    

    try {
        const res = await fetch(`http://localhost:3000/api/flashcards/${deckId}`, {
            method: "GET",
            credentials: "include"
        });

        const resData = await res.json();

        const flashcards: FlashcardViewerPageProps[] = resData.map((flashcard: FlashcardsHomeRes, idx: number) => ({
            id: flashcard.flashcard_id,
            question: flashcard.question,
            answer: flashcard.answer,
            correctCheck: flashcard.correct_check,
            idx: idx
        }));

        console.log(resData);

        let filteredFlashcards = flashcards;

        if (type === 'incorrect') {
            filteredFlashcards = filteredFlashcards.filter((flashcard: FlashcardViewerPageProps) => flashcard.correctCheck === false);
        }

        setFlashcards(filteredFlashcards);

    } catch (e) {
        console.error(`Some error occoured: ${e}`);
    }
}

export default function FlashcardViewerPage() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const deckId = Number(params.deckId);
    const type = searchParams.get('type') || 'all';
    const [flashcards, setFlashcards] = useState<FlashcardViewerPageProps[] | null>(null);
    const [cardIdx, setCardIdx] = useState(0);
    let numOfCards = -1;


    useEffect(() => {
        getFlashcards(deckId, type, setFlashcards);
    }, []);
    
    let firstFlashcard;
    if (flashcards) {
        numOfCards = Object.keys(flashcards).length;
        firstFlashcard = flashcards[cardIdx];

        return (
            <div className="w-full h-screen bg-gray-50 bg-opacity-25">
                    <div className="flex justify-center items-center h-[calc(100vh-16rem)]" >
                    {firstFlashcard &&  <FlashcardViewer id={firstFlashcard.id} question={firstFlashcard.question} answer={firstFlashcard.answer} correctCheck={firstFlashcard.correctCheck}/>}
                </div>
                <NavigationButtons currIdx={cardIdx} setCardIdx={setCardIdx} maxIdx={numOfCards-1} className="fixed bottom-5 left-1/2 -translate-x-1/2" />
            </div>
        );
    } else {

        return (
            <p>You're in the wrong page mate.</p>
        );
    }
    
}