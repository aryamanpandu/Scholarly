import { Button } from "@/components/ui/button"
import {motion} from "framer-motion";

export const MotionButton = motion.create(Button);

export interface ResponseButtonProps {
    showAnswer: boolean,
    onGotIt: () => void,
    onMissedIt: () => void
}

export default function ResponseButtons({showAnswer, onGotIt, onMissedIt} : ResponseButtonProps) {
    return(
        <motion.div
            initial={{opacity: 0}}
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