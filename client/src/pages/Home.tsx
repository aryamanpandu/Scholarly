import Topic from "@/components/Topic"
import { toast } from "sonner"
import { useState } from "react"
import { useEffect } from "react"
import NavBar from "@/components/NavBar"

interface TopicRes {
    topic_id: number,
    topic_name: string,
    topic_desc: string,
    created_at: Date
}

async function refreshTopics(ignore: boolean, setResult: (result: [TopicRes]| null) => void) {
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

    useEffect(() => {
        let ignore = false;

        

        refreshTopics(ignore, setResult)

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
                    createdAt={topic.created_at}
                    id={topic.topic_id}  /> 
                );
            }
        )

        return (
            <>
                <NavBar/>
                <div className="flex gap-5 m-5">
                    {topicArr}
                </div>
            </>
            
        )
    }
    else {
        return (
            <> 
                <div>You have no Topics!</div>
            </>
        )
    }
    
}
