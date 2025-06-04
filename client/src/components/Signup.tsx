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

type FormData = {
    firstName: string,
    lastName: string,
    email: string, 
    password: string,
    confirmPassword: string
}


export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            console.log(`Data provided to the api/signup: ${data}`);
            const res = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            });
            
            const resData = await res.json();
            
            if (resData.loginSuccess) {
                toast.success(resData.message);
                navigate("/login"); 
                
            } else {
                toast.info(resData.message);
            }
            
        } catch (e) {
            toast.error(`Something went wrong. Error: ${e}`);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle className="text-xl">New here? Let's make this official.</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="firstName" className="pb-2">First Name</Label>
                            <Input id="firstName" type="text" className="mb-4" {...register("firstName", { required: "First Name is required." } )} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="lastName" className="pb-2">Last Name</Label>
                            <Input id="lastName" type="text" className="mb-4" {...register("lastName", { required: "Last Name is required." } )} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email" className="pb-2">Email</Label>
                            <Input id="email" type="email" className="mb-4" {...register("email", { required: "Email is required." } )} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password" className="pt-2 pb-2">Password</Label>
                            <Input id="password" type="password" className="mb-4" {...register("password", { required: "Password is required."} )} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="confirmPassword" className="pt-2 pb-2">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" className="mb-4" {...register("confirmPassword", { required: "Enter your password twice."} )} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button type="submit" className="py-4 px-8">Sign up</Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/login" className="text-blue-500 hover:text-blue-600">Already have an account? Log in</Link>
                </CardFooter>
            </Card>
        </div>
    )
    
}