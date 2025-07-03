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

interface EditDeckProps {
    deckName: string,
    deckDesc: string,
    deckId: number,
    topicId: number,
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    onSuccess?: () => void
}


export default function EditDeck({deckName, deckDesc, deckId, topicId, open, onOpenChange, onSuccess}: EditDeckProps) {
    const {register, handleSubmit, formState: {errors} } = useForm<EditDeckProps>();
    const [name, setName] = useState(deckName);
    const [desc, setDesc] = useState(deckDesc);

    const onSubmit: SubmitHandler<EditDeckProps> = async (data) => {
        try {
            const res = await fetch(`http://localhost:3000/api/decks/${topicId}`, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
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
                toast.error(`Failed to update Deck: ${resData.message}`);
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
                        <DialogTitle>Edit Deck</DialogTitle>
                    </DialogHeader>
                <div>
                    <Label htmlFor="deckName" className="mb-2 block">Deck Name</Label>
                    <Input
                        id="deckName"
                        className="mb-4"
                        value={name}
                        {...register("deckName", {required: "Deck Name is required.", onChange: (e) => setName(e.target.value) })}
                    />
                    {errors.deckName && <p className="py-4 px-8">{errors.deckName.message}</p>}
                </div>
                <div>
                    <Label htmlFor="deckDesc" className="mb-2 block">Deck Description</Label>
                    <Textarea
                        id="deckDesc"
                        className="mb-7"
                        placeholder="Enter your topic's description..."
                        rows={2}
                        value={desc}
                        {...register("deckDesc", {required: "Deck Description is required.", onChange: (e) => setDesc(e.target.value)})}
                    />
                    {errors.deckDesc && <p className="py-4 px-8">{errors.deckDesc.message}</p>}
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
