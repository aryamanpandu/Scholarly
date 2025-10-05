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

interface DeleteDeckProps {
    deckId: number,
    topicId: number,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onSuccess: () => void
}

export default function DeleteDeck({deckId, topicId, open, onOpenChange, onSuccess}: DeleteDeckProps) {
    
    const deleteDeckCall = async () => {
        try {
            const res= await fetch(`${API_BASE_URL}/api/decks/${deckId}/${topicId}`, {
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
    
    
    return (
       <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger hidden />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this Deck?</AlertDialogTitle>
                    <AlertDialogDescription>This will delete all the Flashcards associated with this Deck.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({variant: "destructive"})} onClick={deleteDeckCall}>Delete</AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>   
    );
}
