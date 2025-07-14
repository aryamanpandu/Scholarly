import AnimatedDock from "@/components/animata/container/animated-dock"

export default function FlashcardNavBar() {
    return (
        <div className="w-full flex justify-center h-40">
            <AnimatedDock
                items={
                    [
                        {
                            to: '/',
                            icon: <i className="bi bi-arrow-clockwise"></i>,
                            title: "Revise Incorrect Flashcards"
                        },
                        {
                            to: '/',
                            icon: <i className="bi bi-book"></i>,
                            title: "Revise All Flashcards"
                        }
                    ]
                }
                largeClassName="max-w-lg fixed bottom-5"
                smallClassName="max-w-lg fixed bottom-5"
            />
        </div>
    );
}