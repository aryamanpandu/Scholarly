import { Link } from "react-router-dom";
import "./index.css";
import { Card, 
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"


//This is basically a way to create the original login card using shadcdn
export default function LoginCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome back, shall we enter?</CardTitle>
            </CardHeader>
            <CardFooter>
                <Button></Button>
            </CardFooter>
        </Card>
    )
}