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
import { toast } from "sonner";


import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface EditTopicData {
    topicName: string,
    topicDesc: string,
    topicId: number,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}

export default function EditTopic({topicName, topicDesc, topicId, open, onOpenChange}: EditTopicData) {
    const { register, handleSubmit, formState: {errors} } = useForm<EditTopicData>();
    const [name, setName] = useState(topicName);
    const [desc, setDesc] = useState(topicDesc);

    const onSubmit: SubmitHandler<EditTopicData> = async (data) => {
        try {
            const res = await fetch(`http://localhost:3000/api/topics/${topicId}`, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            });

            const resData = await res.json();

            //if the status code is 200
            if (res.status === 200) {
                toast.success(resData.message);
            } else {
                //if the status code is 400 or 401 or 500
                toast.error(resData.message);
            }
            
        } catch (e) {
            
            console.log(e);
            toast.error(`Something went wrong: ${e}`);
            
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!open && !onOpenChange && (
                <DialogTrigger asChild>
                    <div><i className="bi bi-pencil-square"/> Edit</div>
                </DialogTrigger>
            )}
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit Topic</DialogTitle>
                    </DialogHeader>
                <div>
                    <Label htmlFor="topicName" className="mb-1 block">Topic Name</Label>
                    <Input
                        id="topicName"
                        className="mb-4"
                        value={name}
                        {...register("topicName", {required: "Topic Name is required.", onChange: (e) => setName(e.target.value) })}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="topicDesc" className="mb-1 block">Topic Description</Label>
                    <Textarea
                        id="topicDesc"
                        className="mb-7"
                        placeholder="Enter your topic's description..."
                        rows={2}
                        value={desc}
                        {...register("topicDesc", {required: "Topic Description is required.", onChange: (e) => setDesc(e.target.value)})}
                        required
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}