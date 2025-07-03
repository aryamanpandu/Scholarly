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

interface CreateTopicData {
    topicName: string,
    topicDesc?: string
}

interface CreateTopicProps {
    onSuccess: () => void
}

export default function CreateTopic({onSuccess}: CreateTopicProps) {
    const { register, handleSubmit, formState: {errors}} = useForm<CreateTopicData>();

    const onSubmit: SubmitHandler<CreateTopicData> = async (data) => {
        try {

            const res = await fetch(`http://localhost:3000/api/topics`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            });

            const resData = await res.json();

            if (res.ok) {
                onSuccess();
                toast.success(resData.message);
                //how do I close the damn Dialog tho? 
            } else {
                toast.error(`Failed to create a topic: ${resData.message}`);
            }
        } catch (e) {
            toast.error(`Something went wrong: ${e}`);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="fixed bottom-2 right-2 text-2xl font-bold" variant="default"><i className="bi bi-plus-lg"></i></Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create Topic</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="topicName" className="mb-2 block">Topic Name</Label>
                        <Input
                            id="topicName"
                            className="mb-4"

                            placeholder="Physics"
                            {...register("topicName", {required: "A Topic Name is required."})}
                        />
                        {errors.topicName && <p className="py-4 px-8">{errors.topicName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="topicDesc" className="mb-2 block">
                            Topic Description
                        </Label>
                        <Textarea
                            id="topicDesc"
                            className="mb-7"
                            placeholder="Add a description to your Topic for better understanding."
                            {...register("topicDesc")}
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
