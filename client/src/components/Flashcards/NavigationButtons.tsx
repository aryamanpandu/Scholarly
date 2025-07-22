
import { cn } from "@/lib/utils";
import {motion} from "framer-motion";

interface NavigationButtonsProps {
    className?: string,
    currIdx: number,
    maxIdx: number,
    setCardIdx: (idx: number) => void,
    setEnterFromRightAnimation: (goLeft: boolean) => void
}
export default function NavigationButtons({currIdx, maxIdx, setCardIdx, setEnterFromRightAnimation ,className}: NavigationButtonsProps) {
    return (
        <div className={cn("flex", className)}>
            <motion.button 
                className="cursor-pointer"
                whileTap={{scale: 0.8}}
                onClick={() => {
                    setEnterFromRightAnimation(false);
                    navigateLeft(currIdx, setCardIdx);
                    }}
                >
                <i className="bi bi-chevron-left text-3xl"></i>
            </motion.button>

            <span className="text-2xl">{currIdx + 1}/{maxIdx + 1}</span>

            <motion.button
                className="cursor-pointer"
                whileTap={{scale: 0.8}}
                onClick={() => {
                    setEnterFromRightAnimation(true);
                    navigateRight(currIdx, maxIdx, setCardIdx);
                }}
                >
                <i className="bi bi-chevron-right text-3xl"></i>
            </motion.button>
        </div>
    )
}


function navigateLeft(currIdx: number, setCardIdx: (idx: number) => void) {
    if (currIdx > 0) {
        setCardIdx(currIdx - 1);
    }
}

function navigateRight(currIdx: number, maxIdx: number, setCardIdx: (idx: number) => void) {
    if (currIdx < maxIdx) {
        setCardIdx(currIdx + 1);
    }
}