import { 
Card,
CardHeader,
CardTitle,
CardContent,

} from "@/components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ResponseButtons from "@/components/Flashcards/ResponseButtons";
import NavigationButtons from "@/components/Flashcards/NavigationButtons";

export default function FlashcardViewer() {
    const [showAnswer, setShowAnswer] = useState(false);
    
    return (
        <div 
        className="w-full max-w-xl m-5"
        style={{perspective: 1000}}
        >

            <motion.div
                animate={{rotateY: showAnswer ? -180: 0}}
                transition={{duration: 0.3}}
                className="relative w-full aspect-[5/3] cursor-pointer"
                style={{
                    transformStyle: "preserve-3d",
                    margin: "20"
                }}
                onClick={() => setShowAnswer(prev => !prev)}
            >
                <FlashcardQuestion className="absolute"/>

                <FlashcardAnswer className="absolute" />

            </motion.div>
            
            <ResponseButtons showAnswer={showAnswer}/>
            
        </div>
    );
}


function FlashcardQuestion({className }: {className? : string}) {
    return (
        <Card className={cn("w-full h-full box-border flex", className)}
            style={{
                backfaceVisibility: "hidden"
            }}>
            <CardHeader className="flex justify-center">
                <CardTitle>Question</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center w-full grow">
                <div className="md:text-xl font-semibold sm:text-sm">What is a flashcard?</div>
            </CardContent>
        </Card> 
    );
}

function FlashcardAnswer({className} : {className? : string}) {
    return (
        <Card className={cn("w-full h-full box-border flex", className)}
            style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
            }}
        >
            <CardHeader className="flex justify-center">
                <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center grow">
                <div className="md:text-xl break-words font-medium sm:text-sm">A flashcard is a note to test your knowledge. You write the question on one side, and the answer on the other. you flip it to find the answer</div>
            </CardContent>
        </Card>  
    );
}