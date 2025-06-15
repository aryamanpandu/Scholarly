import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteTopicData {
    topicId: number,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}

export default function DeleteTopic({topicId, open, onOpenChange}: DeleteTopicData) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {!open && !onOpenChange && (
                <AlertDialogTrigger asChild>
                    <div><i className="bi bi-trash"></i> Delete</div>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogTitle>Are you sure you want to delete this Topic?</AlertDialogTitle>
                <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>    
    );
}