import FlashcardViewer from "@/components/Flashcards/FlashcardViewer";
import NavigationButtons from "@/components/Flashcards/NavigationButtons";
import NavBar from "@/components/NavBar";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FlashcardsHomeRes } from "@/pages/FlashcardsHome";

import { Link } from "react-router-dom"
import { useParams, useSearchParams } from "react-router-dom"; 
import { useEffect, useState } from "react";

interface FlashcardViewerPageProps {
    id: number,
    question: string,
    answer: string,
    correctCheck: boolean,
    idx: number
}

interface BreadCrumbProps {
    topicId: number,
    topicName: string,
    deckId: number,
    deckName: string
}

export function FlashcardViewerBreadCrumb({topicId, topicName, deckId, deckName}: BreadCrumbProps) {
    return (
        <Breadcrumb className="px-6 pt-3">
            <BreadcrumbList>
                <BreadcrumbLink asChild>
                    <Link to={`/home`}>Home</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbLink asChild>
                    <Link to={`/deckHome/${topicId}`}>{topicName}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbLink asChild>
                    <Link to={`/flashcardHome/${deckId}`}>{deckName}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator /> 
                <BreadcrumbLink asChild>
                    <Link to='#'>Flashcard Viewer</Link>
                </BreadcrumbLink>
            </BreadcrumbList>
        </Breadcrumb>
    );
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

        if (numOfCards > 0) {
            firstFlashcard = flashcards[cardIdx];
            return (
            <div className="w-full h-screen bg-gray-50 bg-opacity-25">
                <FlashcardViewerBreadCrumb topicId={Number(sessionStorage.getItem("topicId"))} topicName={sessionStorage.getItem("topicName") || "Topic"} deckId={deckId} deckName={sessionStorage.getItem("deckName") || "Deck"}/>
                    <div className="flex justify-center items-center h-[calc(100vh-16rem)]" >
                    {firstFlashcard &&  <FlashcardViewer id={firstFlashcard.id} question={firstFlashcard.question} answer={firstFlashcard.answer} correctCheck={firstFlashcard.correctCheck}/>}
                </div>
                <NavigationButtons currIdx={cardIdx} setCardIdx={setCardIdx} maxIdx={numOfCards-1} className="fixed bottom-5 left-1/2 -translate-x-1/2" />
            </div>
            );
        } else {
            return (
                 <div className="w-full h-screen bg-gray-50 bg-opacity-25">
                    <NavBar isLoggedIn={true}/>
                    <FlashcardViewerBreadCrumb topicId={Number(sessionStorage.getItem("topicId"))} topicName={sessionStorage.getItem("topicName") || "Topic"} deckId={deckId} deckName={sessionStorage.getItem("deckName") || "Deck"}/>
                     <div className="flex justify-center items-center h-[calc(100vh-16rem)] text-3xl text-neutral-400">No flashcards to review! Well done.</div>
                </div>
            );
        }
        
    } else {

        return (
            <p>You're in the wrong page mate :P</p>
        );
    }
    
}