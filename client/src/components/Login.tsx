import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast }  from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom";

type LoginFormData = {
    email: string, 
    password: string
}
/*
Now I want to submit the data  as a post to localhost:3000/api/login
Two cases, how do I handle the data. 
Now I need to use useEffect react hook to get data from API so that I know if I am logged in or not
Then I can use that loginSuccess boolean to show the message using a toast. 
Do I need the loginSuccess boolean for that? If I am showing the message anyway.
*/
export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            console.log(data.email);
            const res = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            });
            
            const resData = await res.json();
            
            if (resData.loginSuccess) {
                navigate("/home");
                toast.success(resData.message);
            } else {
                toast.info(resData.message);
            }
            
        } catch (e) {
            toast.error(`Something went wrong. Error: ${e}`);
        }
    }

    return (
        <div className="flex items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle className="text-xl">Welcome back, shall we enter?</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="email" className="pb-2">Email</Label>
                            <Input id="email" type="email" {...register("email", { required: "Email is required." } )} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password" className="pt-2 pb-2">Password</Label>
                            <Input id="password" type="password" {...register("password", { required: "Password is required."} )} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button type="submit" className="py-4 px-8">Login</Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/signup" className="text-blue-500 hover:text-blue-600">Don't have an account? Sign up</Link>
                </CardFooter>
            </Card>
        </div>
    )
}