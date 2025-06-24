import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/logout', {
        method: "POST",
        credentials: "include",
      });
      
      const resData = await res.json();

      if (res.ok) {
        toast.success(resData.message);
        navigate("/login");
      } else {
        toast.error(resData.message);
      }
    } catch (e) {
        console.log(e);
        toast.error(`Something went wrong: ${e}`);
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
}