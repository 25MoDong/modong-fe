import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={()=>navigate(-1)}
      className="w-[26px] h-[26px] flex-shrink-0"
    >
      <ChevronLeft size={26} />
    </button>
  );
}

export default BackButton;