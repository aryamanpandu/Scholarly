import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
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
    id: number
}
//I am going to use three dots ellipsis that will have an option to edit and delete topics.
export default function Topic({name, desc, createdAt, id}: Topic) {
    return (
        <>
        <Card className="w-[400px] mx-4">
            <CardHeader className="flex items-center justify-center gap-1">
                <CardTitle className="text-2xl">{name}</CardTitle>
                <ShowExtraActionMenu topicName={name} topicDesc={desc} topicId={id}/>
            </CardHeader>
            <hr className="mx-6"/>
            <div className="flex justify-center">
                <div className="text-center text-lg m-3">
                    {desc}
                </div>
            </div>
            <div className="flex justify-end px-4">
                <CardDescription>
                    Date supposed to be here.
                    {/* {createdAt.toDateString()} */}
                </CardDescription>
            </div>
        </Card>
        </>
    );
}

interface TopicEdit {
    topicName: string,
    topicDesc: string,
    topicId: number
}

function ShowExtraActionMenu({topicName, topicDesc, topicId}: TopicEdit) {
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
            />

            <DeleteTopic
                topicId={topicId}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            />
        </>
    );
}
