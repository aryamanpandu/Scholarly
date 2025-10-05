
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

    const handleLeftClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const currentScrollY = window.scrollY;

        if (currIdx > 0) {
            setEnterFromRightAnimation(false);
            setCardIdx(currIdx - 1);
            

            requestAnimationFrame(() => {
                window.scrollTo(0, currentScrollY);
            });
        }
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const currentScrollY = window.scrollY;

        if (currIdx < maxIdx) {
            setEnterFromRightAnimation(true);
            setCardIdx(currIdx + 1);

            requestAnimationFrame(() => {
                window.scrollTo(0, currentScrollY);
            });
        }

    };

    return (
        <div className={cn("flex", className)}>
            <motion.button 
                className="cursor-pointer"
                whileTap={{scale: 0.8}}
                onClick={handleLeftClick}
                disabled={currIdx <= 0}
                style={{
                    opacity: currIdx <= 0 ? 0.5 : 1,
                    pointerEvents: currIdx <= 0 ? 'none' : 'auto'
                }}
                >
                <i className="bi bi-chevron-left text-3xl"></i>
            </motion.button>

            <span className="text-2xl">{currIdx + 1}/{maxIdx + 1}</span>

            <motion.button
                className="cursor-pointer"
                whileTap={{scale: 0.8}}
                onClick={handleRightClick}
                disabled={currIdx >= maxIdx}
                style={{
                    opacity: currIdx >= maxIdx ? 0.5 : 1,
                    pointerEvents: currIdx >= maxIdx ? 'none' : 'auto'
                }}
                >
                <i className="bi bi-chevron-right text-3xl"></i>
            </motion.button>
        </div>
    )
}