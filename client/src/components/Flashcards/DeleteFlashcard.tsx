import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogHeader
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { API_BASE_URL } from "@/config/configs";

interface DeleteFlashcardProps {
    flashcardId: number,
    deckId: number,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onSuccess: () => void
}

export default function DeleteFlashcard({flashcardId, deckId, open, onOpenChange, onSuccess}: DeleteFlashcardProps) {
    
    const deleteFlashcardCall = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/flashcards/${flashcardId}/${deckId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const resData = await res.json();

            if (res.ok) {
                onOpenChange(false);
                onSuccess();
                toast.success(resData.message);
            } else {
                toast.error(`Failed to delete Deck: ${resData.message}`);
            }
        } catch (e) {
            console.log(e);
            toast.error(`Something went wrong: ${e}`);
        }
    }
    
    return(
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger hidden />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this Flashcard?</AlertDialogTitle>
                    <AlertDialogDescription>This will delete all the associated data with the Flashcard</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({variant: "destructive"})} onClick={deleteFlashcardCall}>Delete</AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}