import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";

import { useState } from "react";

interface FlashcardProps {
    
}

export default function Flashcard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
            </CardHeader>
        </Card>
    )
}

// export function Deck({id, topicId, name, desc, createdAt, onRefresh}: DeckProps) {
//     return (
//         <Card className="w-full min-w-0 h-full flex flex-col border rounded-xl"> 
//             <CardHeader className="flex items-center justify-center gap-1">
//                 <CardTitle className="text-xl sm:text-2xl text-center break-words">{name}</CardTitle>
//                 <ShowExtraActionMenu deckName={name} deckDesc={desc} deckId={id} topicId={topicId} onRefresh={onRefresh} />
//             </CardHeader>
//             <CardContent>
//                 <hr className="mx-6"/>
//                 <div className="flex justify-center flex-grow">
//                     <div className="text-center text-sm sm:text-base md:text-lg m-3 break-words">
//                         {desc}
//                     </div>
//                 </div>
//             </CardContent>
//             <div className="flex justify-between mt-auto lg:px-6 md:px-4">
//                 <Button variant="default" className="rounded-full cursor-pointer">Flashcards</Button>
//                 <CardDescription className="text-xs sm:text-sm">
//                     Created: {createdAt.toDateString()}
//                 </CardDescription>
//             </div>
//         </Card>
//     );
// }