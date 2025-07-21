import "../components/index.css"
import NavBar from "@/components/NavBar"
import Login from "@/components/Login"

export default function LoginPage() {
    return (
        <div className="w-full h-screen bg-gray-50 bg-opacity-25">
            <div className="flex justify-center">
                <Login />
            </div>
            
        </div>
    );
}