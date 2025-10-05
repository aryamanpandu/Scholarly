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
import { API_BASE_URL } from "@/config/configs";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface EditFlashcardProps {
    question: string,
    answer: string,
    deckId: number,
    flashcardId: number,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onSuccess: () => void
}

export default function EditFlashcard({question: cardQuestion, answer: cardAnswer, deckId, flashcardId, open, onOpenChange, onSuccess}: EditFlashcardProps) {
    const { register, handleSubmit, formState: {errors} } = useForm<EditFlashcardProps>();
    const [question, setQuestion] = useState(cardQuestion);
    const [answer, setAnswer] = useState(cardAnswer);

    const onSubmit: SubmitHandler<EditFlashcardProps> = async (data) => {
        try {

            const res = await fetch(`${API_BASE_URL}/api/flashcards/${flashcardId}/${deckId}`, {
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
                        <Label htmlFor="question" className="mb-2 block">Question</Label>
                        <Input
                            id="question"
                            className="mb-4"
                            value={question}
                            {...register("question", {required: "Flashcard question is required", onChange: (e) => setQuestion(e.target.value)})} 
                        />
                        {errors.question && <p className="py-4 px-8">{errors.question.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="answer" className="mb-2 block">Answer</Label>
                        <Textarea
                            id="answer"
                            className="mb-7"
                            placeholder="Enter the answer to your flashcard here..."
                            rows={2}
                            value={answer}
                            {...register("answer", {required: "Flashcard answer is required", onChange: (e) => setAnswer(e.target.value)})}
                        />
                        {errors.answer && <p className="py-4 px-8">{errors.answer.message}</p>}
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