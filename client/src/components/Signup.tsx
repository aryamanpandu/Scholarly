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
import { API_BASE_URL } from "@/config/configs";

type SignUpFormData = {
    firstName: string,
    lastName: string,
    email: string, 
    password: string,
    confirmPassword: string
}

export default function Signup() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>();
    const navigate = useNavigate();
    const password = watch("password");

    const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/signup`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            });
            
            const resData = await res.json();
            
            if (res.ok) {
                toast.success(resData.message);
                setTimeout(() => {
                    console.log("Completed the user sign up");
                    navigate("/login");
                }, 500); 
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
                    <CardTitle className="text-xl">New here? Let's make this official.</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="firstName" className="pb-2">First Name</Label>
                            <Input id="firstName" type="text" className="mb-4" {...register("firstName", { required: "First Name is required." } )} />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="lastName" className="pb-2">Last Name</Label>
                            <Input id="lastName" type="text" className="mb-4" {...register("lastName", { required: "Last Name is required." } )} />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email" className="pb-2">Email</Label>
                            <Input id="email" type="email" className="mb-4" {...register("email", { 
                                required: "Email is required.",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                                } )} 
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password" className="pt-2 pb-2">Password</Label>
                            <Input id="password" type="password" className="mb-4" {...register("password", { 
                                required: "Password is required.",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least  6 characters"
                                }
                            } )} 
                        />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="confirmPassword" className="pt-2 pb-2">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" className="mb-4" {...register("confirmPassword", { 
                                required: "Enter your password twice.",
                                validate: (value) => value === password || "Passwords do not match"
                                } )} 
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
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