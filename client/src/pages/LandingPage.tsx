import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="bg-gray-200 h-screen">  
            <div className="text-5xl">
                Master Anything. One Flashcard at a Time.
            </div>
            <Button>Get Started</Button>
            <div>
                Learn more <i className="bi bi-arrow-down"></i>
            </div>
        </div>
    );
}

export function GuestNavBar() {

}