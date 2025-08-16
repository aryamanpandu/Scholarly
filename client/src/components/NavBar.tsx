import "./index.css";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import Logout from "./Logout";

export default function NavBar() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-2 md:px-6 border sticky top-0">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-8 w-8" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link to="/home" className="mr-6 hidden lg:flex" >
            <ScholarlyIcon className="h-8 w-8" />
            <span className="sr-only">Scholarly</span>
          </Link>
          <div className="grid gap-2 py-6">
            
              <Link to="/home" className="flex w-full items-center py-2 text-lg font-semibold">
                Home
              </Link>
              <div className="flex w-full items-center py-2 text-lg font-semibold">
                <Logout/>
              </div>

          </div>
        </SheetContent>
      </Sheet>
      <Link to="#" className="mr-6 hidden lg:flex">
        <ScholarlyIcon className="h-6 w-6" />
        <span className="pl-2">Scholarly</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        <Link to="/home" className="flex w-full items-center py-2 text-lg font-semibold">
          Home
        </Link> 
        <div className="flex w-full items-center py-2 text-lg font-semibold">
          <Logout/>
        </div>
      </nav>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function ScholarlyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    height="24px" 
    viewBox="0 -960 960 960" 
    width="24px" fill="#e3e3e3">
    <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/>
    </svg>
  )
}