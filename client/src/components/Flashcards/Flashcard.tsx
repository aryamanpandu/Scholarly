import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import EditFlashcard from "@/components/Flashcards/EditFlashcard";
import DeleteFlashcard from "@/components/Flashcards/DeleteFlashcard";

import { useState } from "react";

interface FlashcardProps {
    question: string,
    answer: string,
    flashcardId: number,
    deckId: number,
    correctCheck: boolean,
    onRefresh: () => void
}
//I am going to add badges to help understand whether the flashcard is new, if the user got it right, or if the user got it wrong.

// Badge Name: Colour
// Mastered: Green
// Needs review: Orange
// Not tried: Grey
export default function Flashcard({question, answer, flashcardId, deckId, correctCheck, onRefresh}: FlashcardProps) {
    return (
        <Card className="w-full min-w-0 h-full flex flex-col border rounded-xl">
            <CardHeader className="flex items-center justify-center gap-1">
                <CardTitle className="text-xl sm:text-2xl text-center break-words">{question}</CardTitle>
                <ShowExtraActionMenu question={question} answer={answer} flashcardId={flashcardId} deckId={deckId} onRefresh={onRefresh} />
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
                <hr className="mx-6"/>
                <div className="flex justify-center flex-grow">
                    <div className="text-center text-sm sm:text-base md:text-lg m-3 break-words text-muted-foreground">
                        {answer}
                    </div>
                </div> 
                <div className="mt-auto">
                    {correctCheck && <Badge className="bg-green-600">Mastered</Badge>}
                    {(correctCheck === false) && <Badge className="bg-orange-600">Needs review</Badge>}
                    {(correctCheck === null) && <Badge className="bg-gray-600">Not tried</Badge>}
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