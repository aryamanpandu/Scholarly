import FlashcardViewer from "@/components/Flashcards/FlashcardViewer";
import NavigationButtons from "@/components/Flashcards/NavigationButtons";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FlashcardsHomeRes } from "@/pages/FlashcardsHome";
import { toast } from "sonner";
import { MotionButton } from "@/components/Flashcards/ResponseButtons";
import { API_BASE_URL } from "@/config/configs";


import { Link, useNavigate } from "react-router-dom"
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

interface FlashcardsResult {
    id: number,
    correctCheck: boolean
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
        const res = await fetch(`${API_BASE_URL}/api/flashcards/${deckId}`, {
            method: "GET",
            credentials: "include"
        });

        const resData = await res.json();

        const flashcards: FlashcardViewerPageProps[] = resData.map((flashcard: FlashcardsHomeRes, idx: number) => ({
            id: flashcard.flashcard_id,
            question: flashcard.question,
            answer: flashcard.answer,
            correctCheck: !!flashcard.correct_check,
            idx: idx
        }));

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
    const [responses, setResponses] = useState<FlashcardsResult[]>([]);
    const [showFinishButton, setShowFinishButton] = useState(false);
    const [enterFromRightAnimation, setEnterFromRightAnimation] = useState(true);

    const navigate = useNavigate();
    
    let numOfCards = -1;

    useEffect(() => {
        getFlashcards(deckId, type, setFlashcards);
    }, []);
    
    const handleResponse = (flashcardId: number, correct: boolean) => {
        setResponses(prev => {
            const existingIdx = prev.findIndex(r => r.id === flashcardId);
            const newResult: FlashcardsResult = {
                id: flashcardId,
                correctCheck: correct
            };

            if (existingIdx >= 0) {
                const updated = [...prev];
                updated[existingIdx] = newResult;
                return updated; 
            } else {
                return [...prev, newResult];
            }
        });

        if (cardIdx < numOfCards - 1) {
            setEnterFromRightAnimation(true);
            setCardIdx(cardIdx+1);        
        } else {
            setShowFinishButton(true);
        }
    }

    const finishSession = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/flashcards/flashcard-result/${deckId}`,{
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responses)
            });

            const resData = await res.json();

            if (res.ok) {
                console.log('Session results saved successfully');
                toast.success(resData.message);
                navigate(`/flashcardHome/${deckId}`);
                
            } else {
                console.error('Failed to save session results');
                toast.error('Failed to save session results. Please try again later');
            }
        } catch (e) {
            console.error(`Some error occoured: ${e}`);
        }
    }

    let flashcard;

    if (flashcards) {
        numOfCards = Object.keys(flashcards).length;

        if (numOfCards > 0) {

            flashcard = flashcards[cardIdx];
            return (
                <div className="w-full h-[calc(100vh-5rem)] bg-gray-200 bg-opacity-25 overflow-x-hidden">
                    <FlashcardViewerBreadCrumb topicId={Number(sessionStorage.getItem("topicId"))} topicName={sessionStorage.getItem("topicName") || "Topic"} deckId={deckId} deckName={sessionStorage.getItem("deckName") || "Deck"}/>
                    <div className="flex justify-center items-center h-[calc(100vh-16rem)]" >
                        {flashcard && <FlashcardViewer key={flashcard.id} id={flashcard.id} question={flashcard.question} answer={flashcard.answer} enterFromRight={enterFromRightAnimation} onResponse={handleResponse} />}
                    </div>
                    <NavigationButtons currIdx={cardIdx} setCardIdx={setCardIdx} maxIdx={numOfCards-1} setEnterFromRightAnimation={setEnterFromRightAnimation} className="fixed bottom-5 left-1/2 -translate-x-1/2" />

                    {showFinishButton &&
                        <div className="flex justify-center">
                            <MotionButton
                                className="bg-purple-600"
                                whileTap={{scale: 0.8}}
                                onClick={finishSession}>
                                    Finish Session
                            </MotionButton>
                        </div>
                    }
                </div>
            );
        } else {
            return(
                <div className="w-full h-screen bg-gray-200 bg-opacity-25">
                    <FlashcardViewerBreadCrumb topicId={Number(sessionStorage.getItem("topicId"))} topicName={sessionStorage.getItem("topicName") || "Topic"} deckId={deckId} deckName={sessionStorage.getItem("deckName") || "Deck"}/>
                    <div className="flex justify-center items-center h-[calc(100vh-16rem)] text-3xl text-neutral-400">You have no Flashcards to review. Well Done!</div>
                </div>
            );
        }
        
    } else {
        return (
            <p>You're in the wrong page mate :P</p>
        );
    }
    
}