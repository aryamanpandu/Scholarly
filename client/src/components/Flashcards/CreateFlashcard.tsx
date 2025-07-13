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

import { useForm, SubmitHandler} from "react-hook-form";


interface CreateFlashcardData {
    cardQuestion: string,
    cardAnswer: string
}

interface CreateFlashcardProps {
    onSuccess: () => void,
    deckId: number,
    open: boolean,
    onOpenChange: (open: boolean) => void
}
export default function CreateFlashcard({ onSuccess, deckId, open, onOpenChange}: CreateFlashcardProps) {
    const { register, handleSubmit, formState: {errors}} = useForm<CreateFlashcardData>();

    const onSubmit: SubmitHandler<CreateFlashcardData> = async (data) => {
        try {
            const res = await fetch(`http://localhost:3000/api/decks/${deckId}`, {
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
            } else {
                toast.error(`Failed to create a Flashcard: ${resData.message}`);
            }

        } catch (e) {
            toast.error(`Something went wrong: ${e}`);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger hidden/>
            <Button className="fixed bottom-2 right-2 text-2xl font-bold" variant="default" onClick={() => {onOpenChange(true)}}><i className="bi bi-plus-lg"></i></Button>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create Flashcard</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="cardQuestion" className="mb-2 block">Question</Label>
                        <Input
                            id="cardQuestion"
                            className="mb-4"
                            placeholder="Physics"
                            {...register("cardQuestion", {required: "A Flashcard question is required."})}
                        />
                        {errors.cardQuestion && <p className="py-4 px-8">{errors.cardQuestion.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cardAnswer" className="mb-2 block">
                            Answer
                        </Label>
                        <Textarea
                            id="cardAnswer"
                            className="mb-7"
                            placeholder="Add the answer to your flashcard here."
                            {...register("cardAnswer", {required: "A flashcard answer is required"})}
                        />
                        {errors.cardAnswer && <p className="py-4 px-8">{errors.cardAnswer.message}</p>}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}