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
    onOpenChange?: (open: boolean) => void,
    onSuccess?: () => void
}

export default function EditTopic({topicName, topicDesc, topicId, open, onOpenChange, onSuccess}: EditTopicData) {
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

            if (res.ok) {
                if (onOpenChange) {
                    onOpenChange(false);
                }

                if (onSuccess) {
                    onSuccess();
                }
                toast.success(resData.message);
            } else {
                //if the status code is 400 or 401 or 500
                toast.error(`Failed to update Topic: ${resData.message}`);
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
                    <Label htmlFor="topicName" className="mb-2 block">Topic Name</Label>
                    <Input
                        id="topicName"
                        className="mb-4"
                        value={name}
                        {...register("topicName", {required: "Topic Name is required.", onChange: (e) => setName(e.target.value) })}
                    />
                    {errors.topicName && <p className="py-4 px-8">{errors.topicName.message}</p>}
                </div>
                <div>
                    <Label htmlFor="topicDesc" className="mb-2 block">Topic Description</Label>
                    <Textarea
                        id="topicDesc"
                        className="mb-7"
                        placeholder="Enter your topic's description..."
                        rows={2}
                        value={desc}
                        {...register("topicDesc", {required: "Topic Description is required.", onChange: (e) => setDesc(e.target.value)})}
                    />
                    {errors.topicDesc && <p className="py-4 px-8">{errors.topicDesc.message}</p>}
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