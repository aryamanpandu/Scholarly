import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import EditTopic from "./EditTopic";
import DeleteTopic from "./DeleteTopic";

import { useState } from "react";

interface Topic {
    name: string,
    desc: string,
    createdAt: Date,
    id: number,
    onRefresh?: () => void
}
//I am going to use three dots ellipsis that will have an option to edit and delete topics.
export default function Topic({name, desc, createdAt, id, onRefresh}: Topic) {
    return (
        <>
            <Card className=" w-full min-w-0 h-full flex flex-col border rounded-xl transition:shadow-md hover:bg-muted">
                <CardHeader className="flex items-center justify-center gap-1">
                    <CardTitle className="text-xl sm:text-2xl text-center break-words">{name}</CardTitle>
                    <ShowExtraActionMenu topicName={name} topicDesc={desc} topicId={id} onRefresh={onRefresh}/>
                </CardHeader>
                <CardContent className="cursor-pointer">
                     <hr className="mx-6"/>
                    <div className="flex justify-center flex-grow">
                        <div className="text-center text-sm sm:text-base md:text-lg m-3 break-words">
                            {desc}
                        </div>
                    </div>
                    
                </CardContent>
                <div className="flex justify-end mt-auto px-4 pb-4">
                        <CardDescription className="text-xs sm:text-sm">
                            Created: {createdAt.toDateString()}
                        </CardDescription>
                    </div>
            </Card>
        </>
    );
}

interface TopicActionMenuProps {
    topicName: string,
    topicDesc: string,
    topicId: number,
    onRefresh?: () => void
}

function ShowExtraActionMenu({topicName, topicDesc, topicId, onRefresh}: TopicActionMenuProps) {
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
                            <i className="bi bi-pencil-square mr-2"/> Edit Topic
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect= {() => {setDeleteDialogOpen(true)}}
                        >
                            <i className="bi bi-trash"></i> Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <EditTopic 
                topicName={topicName} 
                topicDesc={topicDesc} 
                topicId={topicId} 
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={onRefresh}
            />

            <DeleteTopic
                topicId={topicId}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onSuccess={onRefresh}
            />
        </>
    );
}
