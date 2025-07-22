import Topic from "@/components/Topics/Topic"
import { useCallback, useState } from "react"
import { useEffect } from "react"
import CreateTopic from "@/components/Topics/CreateTopic"
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"

interface TopicRes {
    topic_id: number,
    topic_name: string,
    topic_desc: string
}

function HomeBreadCrumb() {
    return (
        <Breadcrumb className="px-6 pt-3">
            <BreadcrumbList>
                <BreadcrumbLink>
                    <Link to={`/home`}>Home</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator/>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export async function refreshTopics(ignore: boolean, setResult: (result: [TopicRes]| null) => void) {
    try {
        const res = await fetch("http://localhost:3000/api/topics", {
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

//I have to take care about changing states
//Do the request to get the information from get 
export default function Home() {
    const [result, setResult] = useState<[TopicRes] | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
                return (
                    <Topic
                    key={topic.topic_id}
                    name={topic.topic_name} 
                    desc={topic.topic_desc} 
                    id={topic.topic_id}
                    onRefresh={handleRefreshTopics}
                    /> 
                );
            }
        )

        return (
            <>
                <HomeBreadCrumb/>
                <div className="flex justify-center">
                    <h1 className="m-4 text-3xl">
                        Topics
                    </h1>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,0px))] gap-5 m-5 auto-rows-fr">
                    {topicArr}
                </div>
                <CreateTopic onSuccess={handleRefreshTopics} open={createDialogOpen} onOpenChange={setCreateDialogOpen}/>
            </>
            
        )
    }
    else {
        return (
            <> 
                <HomeBreadCrumb/>
                <div className="flex justify-center">
                    <h1 className="m-4 text-3xl">
                        Topics
                    </h1>
                </div>
                <div className="flex justify-center items-center h-[calc(100vh-16rem)] text-3xl text-neutral-400">You have no Topics. Click the plus icon to create one!</div>
                <CreateTopic onSuccess={handleRefreshTopics} open={createDialogOpen} onOpenChange={setCreateDialogOpen}/>
            </>
        )
    }
    
}

