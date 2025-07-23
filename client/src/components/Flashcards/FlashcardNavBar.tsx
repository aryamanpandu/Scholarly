import AnimatedDock from "@/components/animata/container/animated-dock"

interface FlashcardNavBarProps {
    deckId: number
}

export default function FlashcardNavBar({deckId}: FlashcardNavBarProps) {
    return (
        <div className="w-full flex justify-center h-40">
            <AnimatedDock
                items={
                    [
                        {
                            to: `/flashcardViewer/${deckId}?type=incorrect`,
                            icon: <i className="bi bi-arrow-clockwise"></i>,
                            title: "Revise Incorrect Flashcards"
                        },
                        {
                            to: `/flashcardViewer/${deckId}?type=all`,
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