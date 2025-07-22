import "../components/index.css"
import Signup from "@/components/Signup"


export default function SignUpPage() {
    return (
        <div className="w-full h-screen bg-gray-50 bg-opacity-25">
            <div className="flex justify-center">
                <Signup/>
            </div>
        </div>
    )
}