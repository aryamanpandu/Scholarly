import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/configs";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/logout`, {
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