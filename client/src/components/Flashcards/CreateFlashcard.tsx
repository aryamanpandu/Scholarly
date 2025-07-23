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

import { MotionButton } from "@/components/Flashcards/ResponseButtons";

interface CreateFlashcardData {
    question: string,
    answer: string
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
            const res = await fetch(`http://localhost:3000/api/flashcards/${deckId}`, {
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
            <MotionButton
                className="fixed bottom-2 right-2 text-2xl font-bold" 
                variant="default" 
                onClick={() => {onOpenChange(true)}}
                whileTap={{scale: 0.6}}
            >
                <i className="bi bi-plus-lg"></i>
            </MotionButton>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create Flashcard</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="question" className="mb-2 block">Question</Label>
                        <Input
                            id="question"
                            className="mb-4"
                            placeholder="Physics"
                            {...register("question", {required: "A Flashcard question is required."})}
                        />
                        {errors.question && <p className="py-2 text-red-500">{errors.question.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="answer" className="mb-2 block">
                            Answer
                        </Label>
                        <Textarea
                            id="answer"
                            className="mb-7"
                            placeholder="Add the answer to your flashcard here."
                            {...register("answer", {required: "A flashcard answer is required"})}
                        />
                        {errors.answer && <p className="py-2 text-red-500">{errors.answer.message}</p>}
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