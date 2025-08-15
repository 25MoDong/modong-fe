import { FiSearch } from "react-icons/fi";

export default function SearchBar({
  placeholder = '최애 장소나 메뉴를 입력해 주세요.',
  onEnter,
  className='',
  variant='light',
}) {
  const variants = {
    light:{
      input: "bg-[#F5F5F5] text-black placeholder:text-gray-400",
      icon: 'text-[#F5F5F5]'
    },
    dark:{
      input: "bg-primary-500 text-secondary-500 border-2 border-secondary-500 placeholder:text-secondary-500",
      icon: 'text-secondary-500'
    },
  };

  const currentVariant = variants[variant] || variants.light;
  
  return (
    <div className={`mt-[12px] relative w-full ${className}`}>
      {/* dark variant일 때만 캐릭터 이미지 표시 */}
      {variant === 'dark' && (
        <img 
          src="images/profile.png"
          alt="돌맹이 캐릭터"
          className="absolute top-0 right-0 w-12 h-8 transform -translate-x-1 -translate-y-5"
        />
      )}
      
      <div className="flex items-center gap-2">
        <FiSearch
          className={`absolute right-[12px] top-1/2 -translate-y-1/2 z-20 stroke-[#939393] ${currentVariant.icon}`}
          size={18}
        />
        <input
          type='text'
          className={`w-full h-[44px] pl-[16px] pr-[40px] text-[14px] z-10 ${currentVariant.input} rounded-xl`}
          placeholder={placeholder}
          onKeyDown={e => {
            if (e.key === 'Enter' && onEnter) onEnter(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
  