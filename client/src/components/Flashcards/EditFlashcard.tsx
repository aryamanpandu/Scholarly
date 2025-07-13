import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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

interface EditFlashcardProps {
    cardQuestion: string,
    cardAnswer: string,
    deckId: number,
    flashcardId: number,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onSuccess: () => void
}

export default function EditFlashcard({cardQuestion, cardAnswer, deckId, flashcardId, open, onOpenChange, onSuccess}: EditFlashcardProps) {
    const { register, handleSubmit, formState: {errors} } = useForm<EditFlashcardProps>();
    const [question, setQuestion] = useState(cardQuestion);
    const [answer, setAnswer] = useState(cardAnswer);

    const onSubmit: SubmitHandler<EditFlashcardProps> = async (data) => {
        try {

            const res = await fetch(`http://localhost:3000/api/flashcards/${flashcardId}/${deckId}`, {
                method: "PUT",
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
                toast.error(`Failed to update Flashcard: ${resData.message}`);
            }
        } catch (e) {
            console.log(e);
            toast.error(`Something went wrong: ${e}`);
        }
    }
     
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger hidden/>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit Flashcard</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="cardQuestion" className="mb-2 block">Question</Label>
                        <Input
                            id="cardQuestion"
                            className="mb-4"
                            value={question}
                            {...register("cardQuestion", {required: "Flashcard question is required", onChange: (e) => setQuestion(e.target.value)})} 
                        />
                        {errors.cardQuestion && <p className="py-4 px-8">{errors.cardQuestion.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cardAnswer" className="mb-2 block">Answer</Label>
                        <Textarea
                            id="cardAnswer"
                            className="mb-7"
                            placeholder="Enter the answer to your flashcard here..."
                            rows={2}
                            value={question}
                            {...register("cardAnswer", {required: "Flashcard answer is required", onChange: (e) => setAnswer(e.target.value)})}
                        />
                        {errors.cardAnswer && <p className="py-4 px-8">{errors.cardAnswer.message}</p>}
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