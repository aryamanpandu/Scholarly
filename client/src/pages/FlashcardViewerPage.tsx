import FlashcardViewer from "@/components/Flashcards/FlashcardViewer";
import NavigationButtons from "@/components/Flashcards/NavigationButtons";
import NavBar from "@/components/NavBar";

export default function FlashcardViewerPage() {
    return (
        <div className="w-full h-screen bg-gray-50 bg-opacity-25">
            <NavBar isLoggedIn={true}/>
            <div className="flex justify-center items-center h-[calc(100vh-16rem)]" >
                <FlashcardViewer />
            </div>
            <NavigationButtons className="fixed bottom-5 left-1/2 -translate-x-1/2"/>
        </div>
    );
}