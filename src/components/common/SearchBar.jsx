import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

/**
 * SearchBar component with debouncing support
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Input placeholder text
 * @param {Function} props.onEnter - Callback when Enter key is pressed
 * @param {Function} props.onSearch - Callback for debounced search
 * @param {string} props.className - Additional CSS classes
 * @param {'light'|'dark'} props.variant - SearchBar theme variant
 * @param {boolean} props.clickable - Whether the search bar is clickable (navigates to search page)
 * @param {number} props.debounceDelay - Debounce delay in milliseconds
 */
export default function SearchBar({
  placeholder = '최애 장소나 메뉴를 입력해 주세요.',
  onEnter,
  onSearch,
  className='',
  variant='light',
  clickable=false,
  value,
  onChange,
}) {
  const [searchValue, setSearchValue] = useState('');
  
  // Use controlled or uncontrolled input
  const inputValue = value !== undefined ? value : searchValue;
  const handleChange = onChange || setSearchValue;
  const navigate = useNavigate();

  // Remove automatic debounced search - only search on explicit action

  const handleInputChange = useCallback((e) => {
    handleChange(e.target.value);
  }, [handleChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (onEnter) {
        onEnter(e.target.value);
      } else if (onSearch) {
        onSearch(e.target.value);
      }
    }
  }, [onEnter, onSearch]);
  
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
    <div className={`mt-3 relative w-full ${variant === 'dark' ? 'z-30' : ''} ${className}`}>
      {/* dark variant일 때만 캐릭터 이미지 표시 */}
      {variant === 'dark' && (
        <img 
          src="images/dolmaeng.png"
          alt="돌맹이 캐릭터"
          className="absolute bottom-0 right-4 w-[89px] h-[75px] transform -translate-x-1 -translate-y-5"
          draggable="false"
          style={{ WebkitUserDrag: 'none' }}
        />
      )}
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSearch && onSearch(inputValue)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="검색 실행"
        >
          <FiSearch
            className={`stroke-[#939393] ${currentVariant.icon}`}
            size={18}
          />
        </button>
        
        {clickable ? (
          <button
            onClick={() => navigate('/search', {state: {variant}})}
            type="button"
            className={`w-full h-11 pl-4 pr-10 text-sm z-10 ${currentVariant.input} rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
            aria-label="검색 페이지로 이동"
          >
            <span>{placeholder}</span>
          </button>
        ) : (
          <input
            type="text"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`w-full h-11 pl-4 pr-10 text-sm z-10 ${currentVariant.input} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all`}
            placeholder={placeholder}
            aria-label="검색어 입력"
          />
        )}
      </div>
    </div>
  );
}
  
