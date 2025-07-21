import { Button } from "@/components/ui/button"
import {motion} from "framer-motion";

export const MotionButton = motion.create(Button);


// You can combine the best of both:

// When the user clicks Got it or Missed it, you update the state locally (in React state or similar).
// Allow them to freely change their answers on each flashcard while they review.
// When they finish reviewing (e.g., they press Finish Session or reach the end), send a single POST request with all their final choices.

// We want this button to also move the user to the next page as it will be annoying to click the response button and also the navigation button
// Uses:
// 1. Set the flashcard to got it or missed it (correctCheck to true or false respectively)
// 2. Move to the next flashcard


// 1. Setting the flashcard to got it or missed it
// To send only one POST request for all the flashcards, we would need to set the correctCheck for each flashcard to true or false
// This means:
// We would need the flashcard ID, deck ID.
// We can store an array of Flashcard objects, which just have the id, deck id and correctCheck value. 

// Then once user selects the Finish session button, the POST request is sent.

export interface ResponseButtonProps {
    showAnswer: boolean,
    onGotIt: () => void,
    onMissedIt: () => void
}

export default function ResponseButtons({showAnswer, onGotIt, onMissedIt} : ResponseButtonProps) {
    return(
        <motion.div
            animate={{opacity: showAnswer ? 1 : 0}}
            transition={{duration: 0.3}}
            className="flex gap-5 justify-center text-white mt-5"
        >
            <MotionButton 
                className="px-10 bg-green-500 hover:bg-green-600"
                whileTap={{scale: 0.8}}
                onClick={onGotIt}
            >
                Got it
            </MotionButton>
            <MotionButton 
                className="px-8 bg-red-500 hover:bg-red-600"
                whileTap={{scale:0.8}}
                onClick={onMissedIt}
            >
                Missed it
            </MotionButton>
        </motion.div>
    )
}