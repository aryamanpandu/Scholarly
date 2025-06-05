import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useState } from "react";

interface Topic {
    name: string,
    desc: string,
    createdAt: Date
}
//I am going to use three dots ellipsis that will have an option to edit and delete topics.
export default function Topic({name, desc, createdAt}: Topic) {
    return (
        <>
        <h1>Hello world, this is a test sentence</h1>
        <Card className="w-[400px] mx-4">
            <CardHeader className="flex justify-center">
                <CardTitle className="text-2xl">{name}</CardTitle>
                <ShowExtraActionMenu topicName={name} topicDesc={desc}/>
            </CardHeader>
            <hr className="mx-6"/>
            <div className="flex justify-center">
                <div className="text-center text-lg ">
                    {desc}
                </div>
            </div>
            <div className="flex justify-end px-4">
                <CardDescription>
                    Created: {createdAt.toDateString()}
                </CardDescription>
            </div>
        </Card>
        </>
    );
}

interface TopicEdit {
    topicName: string,
    topicDesc: string
}

function ShowExtraActionMenu({topicName, topicDesc}: TopicEdit) {
    
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="border-none"><i className="bi bi-three-dots-vertical"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem 
                        onSelect= {(e) => {e.preventDefault();}}>
                            <EditTopic topicName={topicName} topicDesc={topicDesc} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        onSelect= {(e) => {e.preventDefault();}}>
                            <DeleteTopic/>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            
        </>
    );
}



function EditTopic({topicName, topicDesc}: TopicEdit) {
    const [name, setName] = useState(topicName);
    const [desc, setDesc] = useState(topicDesc);

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <div><i className="bi bi-pencil-square"/> Edit</div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Topic</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="topicName" className="mb-1 block">Topic Name</Label>
                        <Input id="topicName" name="topicName" value={name} onChange={(e) => setName(e.target.value)} autoFocus={false}></Input>
                    </div>
                    <div>
                        <Label htmlFor="topicDesc" className="mb-1 block">Topic Description</Label>
                        <Textarea 
                            id="topicDesc"
                            placeholder="Enter your topic's description..."
                            rows={2}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            autoFocus={false} 
                        ></Textarea>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                    </DialogContent>
            </form>
        </Dialog>
    );
}

//Just show a dialog to ask the user if they are sure they want to delete something
function DeleteTopic() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div><i className="bi bi-trash"></i> Delete</div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Are you sure you want to delete this Topic?</AlertDialogTitle>
                <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>    
    );
}

//what would I need in a topic? 
// Topic Name
// Topic Description
// How do I create it as link so that the user can hover on it and use it to go to the Decks of that topic? We will think about it when we get there.

// Use shadcn dialog for the edit page. This will be great.

//Steps to create this
// Create a topic with hardcoded values
// Change the hardcoaded values to arguments

// I also need to ensure that the description is only