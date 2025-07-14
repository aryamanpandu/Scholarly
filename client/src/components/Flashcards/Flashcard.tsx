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

import EditFlashcard from "@/components/Flashcards/EditFlashcard";
import DeleteFlashcard from "@/components/Flashcards/DeleteFlashcard";

import { useState } from "react";

interface FlashcardProps {
    question: string,
    answer: string,
    flashcardId: number,
    deckId: number,
    onRefresh: () => void
}

export default function Flashcard({question, answer, flashcardId, deckId, onRefresh}: FlashcardProps) {
    return (
        <Card className="w-full min-w-0 h-full flex flex-col border rounded-xl">
            <CardHeader className="flex items-center justify-center gap-1">
                <CardTitle className="text-xl sm:text-2xl text-center break-words">{question}</CardTitle>
                <ShowExtraActionMenu question={question} answer={answer} flashcardId={flashcardId} deckId={deckId} onRefresh={onRefresh} />
            </CardHeader>
            <CardContent>
                <hr className="mx-6"/>
                <div className="flex justify-center flex-grow">
                    <div className="text-center text-sm sm:text-base md:text-lg m-3 break-words">
                        {answer}
                    </div>
                </div> 
            </CardContent>
        </Card>
    )
}

interface FlashcardActionMenuProps {
    question: string,
    answer: string,
    flashcardId: number,
    deckId: number,
    onRefresh: () => void
}


function ShowExtraActionMenu({question, answer, flashcardId, deckId, onRefresh}: FlashcardActionMenuProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div><i className="bi bi-three-dots-vertical text-xl text-muted-foreground cursor-pointer"/></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => {setEditDialogOpen(true)}}>
                            <i className="bi bi-pencil-square mr-2"/> Edit Flashcard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect= {() => {setDeleteDialogOpen(true)}}>
                            <i className="bi bi-trash"/> Delete Flashcard
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditFlashcard
                question={question}
                answer={answer}
                flashcardId={flashcardId}
                deckId={deckId}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={onRefresh}
            />

            <DeleteFlashcard
                flashcardId={flashcardId}
                deckId={deckId}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onSuccess={onRefresh}
            />
            
        </>
    );
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