import Deck from "@/components/Decks/Deck";
import { useCallback, useState } from "react"
import { useEffect } from "react"
import NavBar from "@/components/NavBar"
import CreateDeck from "@/components/Decks/CreateDeck";

interface DecksHomeRes {
    deck_id: number,
    deck_name: string,
    deck_desc: string,
    created_at: Date
}

interface DecksHomeProps {
    topic_id: number
}

export async function refreshDecks(ignore: boolean, setResult: (result: [DecksHomeRes] | null) => void, topic_id: number) {
    try {
        const res = await fetch(`http://localhost:3000/api/decks/${topic_id}`, {
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


export default function DecksHome({topic_id}: DecksHomeProps) {

    const [result, setResult] = useState<[DecksHomeRes] | null>(null);

    const handleRefreshDecks = useCallback(() => {
        refreshDecks(false, setResult, topic_id);
    }, []);
    
    useEffect(() => {
        let ignore = false;

        refreshDecks(ignore, setResult, topic_id);

        return () => {
            ignore = true;
        }
    }, []);

    if (result && result.length > 0) {
        let deckArr = result.map((deck: DecksHomeRes) => 
            {
                console.log(deck);
                return (
                    <Deck
                        id={deck.deck_id}
                        topicId={topic_id}
                        name={deck.deck_name}
                        desc={deck.deck_desc}
                        createdAt={deck.created_at}
                    />
                );
        });

        return (
            <>
                <NavBar isLoggedIn={true}/>
                <div>
                    {deckArr}
                </div>
                <CreateDeck onSuccess={handleRefreshDecks} topicId={topic_id}/>
            </>
        )


    }
}