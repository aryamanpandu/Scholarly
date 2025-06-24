import Topic from "@/components/Topic"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import NavBar from "@/components/NavBar"
import CreateTopic from "@/components/CreateTopic"

interface TopicRes {
    topic_id: number,
    topic_name: string,
    topic_desc: string,
    created_at: Date
}

export async function refreshTopics(ignore: boolean, setResult: (result: [TopicRes]| null) => void) {
    try {
        const res = await fetch("http://localhost:3000/api/topics", {
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

//I have to take care about changing states
//Do the request to get the information from get 
export default function Home() {
    const [result, setResult] = useState<[TopicRes] | null>(null);

        const handleRefreshTopics = useCallback(() => {
            refreshTopics(false, setResult);
        }, []);

    useEffect(() => {
        let ignore = false;

        refreshTopics(ignore, setResult);

        return () => {
            ignore = true;
        }
    }, []);         
   
    
    if (result && result.length > 0) {
        
        let topicArr = result.map((topic:TopicRes)  => 
            {
                console.log(topic);
                return (
                    <Topic
                    key={topic.topic_id}
                    name={topic.topic_name} 
                    desc={topic.topic_desc} 
                    createdAt={new Date(topic.created_at)}
                    id={topic.topic_id}
                    onRefresh={handleRefreshTopics}
                    /> 
                );
            }
        )

        return (
            <>
                <NavBar isLoggedIn={true}/>
                <div className="flex gap-5 m-5">
                    {topicArr}
                </div>
                <CreateTopic onSuccess={handleRefreshTopics}/>
            </>
            
        )
    }
    else {
        return (
            <> 
                <NavBar isLoggedIn={true}/>
                <div className="text-muted">You have no Topics!</div>
                <CreateTopic onSuccess={handleRefreshTopics}/>
            </>
        )
    }
    
}
