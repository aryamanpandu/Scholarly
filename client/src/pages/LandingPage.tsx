import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    FlashcardQuestion,
    FlashcardAnswer, 
} from "@/components/Flashcards/FlashcardViewer";
import { useState, useRef } from "react";
import NavigationButtons from "@/components/Flashcards/NavigationButtons";



export default function LandingPage() {
    const [idx, setIdx] = useState(0);
    const [enterFromRight, setEnterFromRight] = useState(true);

    const flashcardSectionRef = useRef<HTMLDivElement | null>(null);
    const scrollToFlashcards = () => {
        flashcardSectionRef.current?.scrollIntoView({behavior: "smooth"});
    }
    return (
        <div>
            <div className="bg-gray-200 h-screen flex justify-center items-center flex-col">  
                <div className="text-5xl">
                    Master Anything.
                </div>
                <div className="text-4xl text-gray-500">
                    One Flashcard at a Time.
                </div>
                <div className="m-5">
                    <Button className="mr-3">
                        <Link to="/signup">
                        Get Started
                        </Link>
                    </Button>
                    <span onClick={scrollToFlashcards} className="cursor-pointer">
                        Learn more <i className="bi bi-arrow-down"></i>
                    </span>
                </div>
            </div>
            <div 
                ref={flashcardSectionRef}
                className="bg-gray-200 h-screen flex flex-col items-center justify-center">
                <LandingPageFlashcardViewer 
                    enterFromRight={enterFromRight} 
                    idx={idx} />
                <NavigationButtons 
                    currIdx={idx}
                    maxIdx={5} 
                    setCardIdx={setIdx} 
                    setEnterFromRightAnimation={setEnterFromRight} 
                    className=""/>
            </div>
        </div>
        
    );
}

export function GuestNavBar() {

}

interface LandingPageFlashcardViewerProps {
    enterFromRight: boolean,
    idx: number
}
//Step 1: Show one Flashcard in the landing page
function LandingPageFlashcardViewer({enterFromRight, idx}: LandingPageFlashcardViewerProps) {
    const questions = [
        "Why use Flashcards for Studying?",
        "What is Scholarly?", 
        "Why use Scholarly?", 
        "Is Scholarly Paid?", 
        "What if I find a bug?", 
        "How can I support Scholarly for future updates?"
    ];

    const answers = [
        "Flashcards are research backed to improve your long term memory.", 
        "Scholarly is a simple and efficient open source Flashcard software. It gives users a smooth experience and it allows them to self host the application using docker!",
        "Scholarly improves organization of flashcards by dividing them into topics, then decks. We are also working on bringing an AI feature to create flashcards by using the OpenAI API!",
        "Nope! Scholarly is a personal project by me so that students can have a great study experience!",
        "When you find a bug, please create an issue on the Scholarly Github with a description and a screenshot of the bug if possible.",
        "It would mean a lot to me if you could support my endeavours by buying me a coffee :)"
    ];

    
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <motion.div 
            className="w-full max-w-xl m-5"
            style={{perspective: 1000}}
            initial={{x: enterFromRight ? "100vw": "-100vw"}}
            animate={{x: "0"}}
            exit={{x: enterFromRight ? "-100vw": "100vw"}}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 0.2,
            }}
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
                <FlashcardQuestion className="absolute" question={questions[idx]}/>

                <FlashcardAnswer className="absolute" answer={answers[idx]}/>

            </motion.div>
            
        </motion.div>
    );
}

//How do I do links in a string?


//Link for Flashcard studying: https://pmc.ncbi.nlm.nih.gov/articles/PMC8368120/