import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <>
            <div className="bg-gray-200 h-screen flex justify-center items-center flex-col">  
                <div className="text-5xl">
                    Master Anything.
                </div>
                <div className="text-5xl">
                    One Flashcard at a Time.
                </div>
                <div>
                    <Button>Get Started</Button>
                    <div>
                        Learn more <i className="bi bi-arrow-down"></i>
                    </div>
                </div>
                
            </div>
        </>
        
    );
}

export function GuestNavBar() {

}