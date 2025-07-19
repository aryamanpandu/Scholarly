
import { cn } from "@/lib/utils";
import {motion} from "framer-motion";

export default function NavigationButtons({className}: {className?: string}) {
    return (
        <div className={cn("flex", className)}>
            <LeftNavigation/>
            <span className="text-2xl">1/28</span>
            <RightNavigation/>
        </div>
    )
}

function LeftNavigation() {
    return (
        <motion.button 
            className="cursor-pointer"
            whileTap={{scale: 0.8}}
        >
            <i className="bi bi-chevron-left text-3xl"></i>
        </motion.button>
        
    )
}

function RightNavigation() {
    return (
        <motion.button
            className="cursor-pointer"
            whileTap={{scale: 0.8}}
        >
            <i className="bi bi-chevron-right text-3xl"></i>
        </motion.button>
    )
}