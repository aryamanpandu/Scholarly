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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

import EditDeck from "@/components/Decks/EditDeck";
import DeleteDeck from "@/components/Decks/DeleteDeck";

interface DeckProps {
    id: number,
    topicId: number,
    name: string,
    desc: string,
    onRefresh: () => void
}

export default function Deck({id, topicId, name, desc, onRefresh}: DeckProps) {
    return (
        <Card className="w-full min-w-0 h-full flex flex-col border rounded-xl"> 
            <CardHeader className="flex items-center justify-center gap-1">
                <CardTitle className="text-xl sm:text-2xl text-center break-words">{name}</CardTitle>
                <ShowExtraActionMenu deckName={name} deckDesc={desc} deckId={id} topicId={topicId} onRefresh={onRefresh} />
            </CardHeader>
            <CardContent>
                <hr className="mx-6"/>
                <div className="flex justify-center flex-grow">
                    <div className="text-center text-sm sm:text-base md:text-lg m-3 break-words text-muted-foreground">
                        {desc}
                    </div>
                </div>
            </CardContent>
            <div className="flex justify-between mt-auto lg:px-6 md:px-4">
                <Button variant="default" className="rounded-full cursor-pointer px-5 py-3" onClick={() => {sessionStorage.setItem("deckName", name)}}> <Link to={`/flashcardHome/${id}`}>Flashcards <i className="bi bi-arrow-right-circle-fill"></i></Link></Button>
            </div>
        </Card>
    );
}

interface DeckActionMenuProps {
    deckName: string,
    deckDesc: string,
    deckId: number,
    topicId: number,
    onRefresh: () => void
}

function ShowExtraActionMenu({deckName, deckDesc, deckId, topicId, onRefresh}: DeckActionMenuProps) {
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
                            onSelect= {() => {setEditDialogOpen(true)}}
                        >
                            <i className="bi bi-pencil-square mr-2"/> Edit Deck
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect= {() => {setDeleteDialogOpen(true)}}
                        >
                            <i className="bi bi-trash"/> Delete Deck
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <EditDeck 
                deckName={deckName} 
                deckDesc={deckDesc}
                deckId={deckId} 
                topicId={topicId} 
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={onRefresh}
            />

            <DeleteDeck
                deckId={deckId}
                topicId={topicId}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onSuccess={onRefresh}
            />
        </>
    );
}