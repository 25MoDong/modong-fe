import { ChevronLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackBar({ onToggleLike, liked=false }) {
  const nav = useNavigate();
  return (
    <div className="h-20 bg-[#E9E9EC] px-4 flex items-end pb-2">
      <button
        aria-label="뒤로가기"
        onClick={() => nav(-1)}
        className="mr-2 p-1 -ml-1"
      >
        <ChevronLeft size={22} className="text-[#1B2340]" />
      </button>
      <span className="text-[15px] text-[#1B2340]"></span>
      
    </div>
  );
}
