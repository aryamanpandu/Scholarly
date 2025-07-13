import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";


interface DeleteTopicData {
    topicId: number,
    topicName: string,
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    onSuccess?: () => void
}


export default function DeleteTopic({topicId, topicName, open, onOpenChange, onSuccess}: DeleteTopicData) {
    
    const deleteTopicCall = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/topics/${topicId}/${topicName}`, {
                method: "DELETE",
                credentials: "include",
            })

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
                toast.error(`Failed to delete Topic: ${resData.message}`);
            }
        } catch (e) {
            console.log(e);
            toast.error(`Something went wrong: ${e}`);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {!open && !onOpenChange && (
                <AlertDialogTrigger asChild>
                    <div><i className="bi bi-trash"></i> Delete</div>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this Topic?</AlertDialogTitle>
                    <AlertDialogDescription>This will delete all the Decks and Flashcards associated with this Topic.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({variant: "destructive"})} onClick={deleteTopicCall}>Delete</AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>    
    );
}