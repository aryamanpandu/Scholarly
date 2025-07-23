import Deck from "@/components/Decks/Deck";
import { useCallback, useState } from "react"
import { useEffect } from "react"
import CreateDeck from "@/components/Decks/CreateDeck";
import { useParams } from "react-router-dom"; 
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom"

interface DecksHomeRes {
    deck_id: number,
    deck_name: string,
    deck_desc: string
}

interface DecksHomeBreadCrumbProps {
    topicId: number,
    topicName: string
}

function DecksHomeBreadCrumb({topicId , topicName}: DecksHomeBreadCrumbProps) {
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
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export async function refreshDecks(ignore: boolean, setResult: (result: [DecksHomeRes] | null) => void, topic_id: number) {
    try {
        const res = await fetch(`http://localhost:3000/api/decks/${topic_id}`, {
            method: "GET",
            credentials: "include"
        });

        const resData = await res.json();

        if (!ignore) {
            setResult(resData);
        }
    } catch (e) {
        console.error(`Fetch failed: ${e}`);
    }
}


export default function DecksHome() {
    const params = useParams();
    const topicId = Number(params.topicId);
    const [result, setResult] = useState<[DecksHomeRes] | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleRefreshDecks = useCallback(() => {
        refreshDecks(false, setResult, topicId);
    }, []);
    
    useEffect(() => {
        let ignore = false;

        refreshDecks(ignore, setResult, topicId);

        return () => {
            ignore = true;
        }
    }, []);

    if (result && result.length > 0) {
        let deckArr = result.map((deck: DecksHomeRes) => 
            {
                return (
                    <Deck
                        key={deck.deck_id}
                        id={deck.deck_id}
                        topicId={topicId}
                        name={deck.deck_name}
                        desc={deck.deck_desc}
                        onRefresh={handleRefreshDecks}
                    />
                );
        });

        return (
            <div className="h-[calc(100vh-5rem)] bg-gray-50 bg-opacity-25">
                <DecksHomeBreadCrumb topicId={topicId} topicName={sessionStorage.getItem("topicName") || "Topic"}  />
                <div className="flex justify-center">
                    <h1 className="m-4 text-3xl">{sessionStorage.getItem("topicName") || "Topic"}</h1>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,0px))] gap-5 m-5 auto-rows-fr">
                    {deckArr}
                </div>
                <CreateDeck onSuccess={handleRefreshDecks} topicId={topicId} open={createDialogOpen} onOpenChange={setCreateDialogOpen}/>
            </div>
        );
    } else {
        return(
            <div className="h-[calc(100vh-5rem)] bg-gray-50 bg-opacity-25">
                <DecksHomeBreadCrumb topicId={topicId} topicName={sessionStorage.getItem("topicName") || "Topic"}  />
                <div className="flex justify-center">
                    <h1 className="m-4 text-3xl">{sessionStorage.getItem("topicName") || "Topic"}</h1>
                </div>
                <div className="flex justify-center items-center h-[calc(100vh-16rem)] text-3xl text-neutral-400">You have no Decks. Click the plus icon to create one!</div>
                <CreateDeck onSuccess={handleRefreshDecks} topicId={topicId} open={createDialogOpen} onOpenChange={setCreateDialogOpen}/>
            </div>
        )
    }
}