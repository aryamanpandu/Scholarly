import Flashcard from "@/components/Flashcards/Flashcard";
import { useCallback, useState } from "react";
import { useEffect } from "react"
import NavBar from "@/components/NavBar"
import { useParams } from "react-router-dom"; 
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom"
import CreateFlashcard from "@/components/Flashcards/CreateFlashcard";
import FlashcardNavBar from "@/components/Flashcards/FlashcardNavBar";

interface FlashcardsHomeRes {
    flashcard_id: number,
    question: string,
    answer: string
}

interface FlashcardsHomeBreadCrumbProps {
    topicId: number,
    topicName: string,
    deckId: number,
    deckName: string
}



function FlashcardsHomeBreadCrumb({topicId, topicName, deckId, deckName}: FlashcardsHomeBreadCrumbProps) {
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
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export async function refreshFlashcards(ignore: boolean, setResult: (result: [FlashcardsHomeRes] | null) => void, deck_id: number) {
    try {
        const res = await fetch(`http://localhost:3000/api/flashcards/${deck_id}`, {
            method: "GET",
            credentials: "include"
        });

        const resData = await res.json();

        if (!ignore) {
            console.log(`resData value: ${JSON.stringify(resData)}`);
            setResult(resData);
        }
    } catch (e) {
        console.error(`Fetch failed: ${e}`);
    }
}

export default function FlashcardsHome() {
    const params = useParams();
    const deckId = Number(params.deckId);
    const [result, setResult] = useState<[FlashcardsHomeRes] | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleRefreshFlashcards = useCallback(() => {
        refreshFlashcards(false,setResult, deckId);
    }, []);

    useEffect(() => {
        let ignore = false;
        refreshFlashcards(ignore, setResult, deckId);

        return () => {
            ignore = true;
        }
    }, []);

    if (result && result.length > 0) {
        let flashcardArr = result.map((flashcard: FlashcardsHomeRes) => {
            return (
                <Flashcard
                    flashcardId={flashcard.flashcard_id}
                    deckId={deckId}
                    question={flashcard.question}
                    answer={flashcard.answer}
                    onRefresh={handleRefreshFlashcards}
                />  
            );
        });
    

        return (
            <>
            <NavBar isLoggedIn={true} />
            <FlashcardsHomeBreadCrumb topicId={Number(sessionStorage.getItem("topicId"))} topicName={sessionStorage.getItem("topicName") || "Topic"} deckId={deckId} deckName={sessionStorage.getItem("deckName") || "Deck"}/>
            <div className="flex justify-center">
                <h1 className="m-4 text-3xl border-b-2">{sessionStorage.getItem("deckName") || "Deck"}</h1>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,0px))] gap-5 m-5 auto-rows-fr">
                {flashcardArr}
            </div>
            <FlashcardNavBar />
            <CreateFlashcard onSuccess={handleRefreshFlashcards} deckId={deckId} open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
            </>
        );
    } else {
            return(
                <>
                    <NavBar isLoggedIn={true}/>
                    <FlashcardsHomeBreadCrumb topicId={Number(sessionStorage.getItem("topicId"))} topicName={sessionStorage.getItem("topicName") || "Topic"} deckId={deckId} deckName={sessionStorage.getItem("deckName") || "Deck"}/>
                    <div className="flex justify-center">
                        <h1 className="m-4 text-3xl border-b-2">{sessionStorage.getItem("deckName") || "Deck"}</h1>
                    </div>
                    <div className="flex justify-center items-center h-[calc(100vh-16rem)] text-3xl text-neutral-400">You have no Flashcards. Click the plus icon to create one!</div>
                    <CreateFlashcard onSuccess={handleRefreshFlashcards} deckId={deckId} open={createDialogOpen} onOpenChange={setCreateDialogOpen}/>
                </>
            )
        }

}