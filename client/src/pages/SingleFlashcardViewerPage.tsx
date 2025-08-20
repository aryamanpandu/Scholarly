import { API_BASE_URL } from "@/config/configs";
import { FlashcardViewerBreadCrumb } from "./FlashcardViewerPage"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FlashcardViewer from "@/components/Flashcards/FlashcardViewer";

interface SingleFlashcard {
    id: number,
    question: string,
    answer: string
}

export default function SingleFlashcardViewerPage() {
    const params = useParams();
    const flashcardId = Number(params.flashcardId);
    const deckId = Number(params.deckId);
    const [flashcard, setFlashcard] = useState<SingleFlashcard | null>(null);

    useEffect(() => {
        getSingleFlashcard(flashcardId, deckId, setFlashcard)
    }, []);

    return (
        <div className="w-full h-[calc(100vh-5rem)] bg-gray-200 bg-opacity-25 overflow-x-hidden">
            <FlashcardViewerBreadCrumb topicId={Number(sessionStorage.getItem("topicId"))} topicName={sessionStorage.getItem("topicName") || "Topic"} deckId={deckId} deckName={sessionStorage.getItem("deckName") || "Deck"}/>
            <div className="flex justify-center items-center h-[calc(100vh-16rem)]" >
                {flashcard && <FlashcardViewer id={flashcardId} question={flashcard.question} answer={flashcard.answer} enterFromRight={true} />}
            </div>
        </div>
    );
}

async function getSingleFlashcard(flashcardId: number, deckId: number, setFlashcard: (flashcard: (SingleFlashcard | null)) => void) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/flashcards/${flashcardId}/${deckId}`, {
            method: "GET",
            credentials: "include"
        });

        const resData = await res.json();
        const card = resData[0];

        const flashcard: SingleFlashcard = {
            id: card.flashcard_id,
            question: card.question,
            answer: card.answer
        };

        setFlashcard(flashcard);
    } catch (e) {
        console.error(`Unable to fetch single flashcard with flashcard ID: ${flashcardId}. Error: ${e}`);
    }
}