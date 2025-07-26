import "./index.css";
import { Sheet, SheetTrigger, SheetContent,SheetClose  } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
const MotionLink = motion(Link);
function ScholarlyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
      <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
    </svg>
  );
}

const sidebarVariants = {
  open: {
    clipPath: `circle(1200px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  },
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  })
};

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    
    <header className="flex h-20 w-full shrink-0 items-center px-2 md:px-6 border sticky top-0 bg-background z-50">
      {/* Mobile Framer Motion Sidebar */}
      <div className="lg:hidden relative z-50">
  <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
    <MenuIcon className="h-8 w-8" />
  </Button>

  <AnimatePresence>
    {isOpen && (
      <motion.aside
        initial="closed"
        animate="open"
        exit="closed"
        variants={sidebarVariants}
        //change the color here
        className="fixed top-0 left-0 h-full w-1/3 bg-amber-400 overflow-hidden shadow-xl"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-50"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </button>

        {/* Sidebar Links */}
        <motion.div
          className="absolute left-6 top-20 flex flex-col gap-6"
          initial="hidden"
          animate="visible"
        >
          <MotionLink
            to="/home"
            custom={0}
            variants={itemVariants}
            className="text-xl font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Home
          </MotionLink>

          <motion.div custom={1} variants={itemVariants}>
            <Logout />
          </motion.div>
        </motion.div>
      </motion.aside>
    )}
  </AnimatePresence>
</div>


      {/* Logo for larger screens */}
      <Link to="/" className="ml-4 mr-6 hidden lg:flex items-center gap-2">
        <ScholarlyIcon className="h-6 w-6" />
        <span className="text-lg font-bold">Scholarly</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="ml-auto hidden lg:flex gap-6">
        <Link to="/home" className="flex items-center py-2 text-lg font-semibold">
          Home
        </Link>
        <div className="flex items-center py-2 text-lg font-semibold">
          <Logout />
        </div>
      </nav>
    </header>
  );
}
