import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/configs";

import { useForm, SubmitHandler} from "react-hook-form";

interface CreateDeckData {
    deckName: string,
    deckDesc?: string
}

interface CreateDeckProps {
    onSuccess: () => void,
    topicId: number,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

export default function CreateDeck({onSuccess, topicId, open, onOpenChange}: CreateDeckProps){
    const { register, handleSubmit, formState: {errors}} = useForm<CreateDeckData>();
    

    const onSubmit: SubmitHandler<CreateDeckData> = async (data) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/decks/${topicId}`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const resData = await res.json();

            if (res.ok) {
                onOpenChange(false);
                onSuccess();
                toast.success(resData.message);
                //how do I close the damn Dialog tho? 
            } else {
                toast.error(`Failed to create a deck: ${resData.message}`);
            }
        } catch (e) {
            toast.error(`Something went wrong: ${e}`);
        }
        
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger hidden />
            <Button className="fixed bottom-2 right-2 text-2xl font-bold" variant="default" onClick={() => {onOpenChange(true)}}><i className="bi bi-plus-lg"></i></Button>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create Deck</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="deckName" className="mb-2 block">Deck Name</Label>
                        <Input
                            id="deckName"
                            className="mb-4"

                            placeholder="Physics"
                            {...register("deckName", {required: "A Deck Name is required."})}
                        />
                        {errors.deckName && <p className="py-4 px-8">{errors.deckName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="deckDesc" className="mb-2 block">
                            Topic Description
                        </Label>
                        <Textarea
                            id="deckDesc"
                            className="mb-7"
                            placeholder="Add a description to your Deck for better understanding."
                            {...register("deckDesc")}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}