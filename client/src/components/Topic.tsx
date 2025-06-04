import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
interface Topic {
    name: string,
    desc: string,
    createdAt: Date
}

export default function Topic({name, desc, createdAt}: Topic) {
    return (
        <>
        <h1>Hello world, this is a test sentence</h1>
        <Card className="w-[400px] mx-4">
            <CardHeader className="flex justify-center">
                <CardTitle className="text-2xl">{name} </CardTitle>
            </CardHeader>
            <EditTopic></EditTopic>
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

function EditTopic() {

    // will need to add form onSubmit etc.
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="border-none"><i className="bi bi-pencil-square"></i></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Topic</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label></Label>
                    </div>
                </DialogContent>
            </form>
        </Dialog>
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