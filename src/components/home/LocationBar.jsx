import { FiChevronDown } from 'react-icons/fi';

export default function LocationBar({ 
  text = '정릉로 77', 
  onClick, 
  className = '',
  hasContainer = true // 패딩 컨테이너 포함 여부
}) {
  const content = (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-[4px] title-18 ${className}`}
    >
      <span>{text}</span>
      <FiChevronDown className="text-gray-500" size={18} />
    </button>
  );

  // 패딩 컨테이너가 필요한 경우와 아닌 경우 분기
  if (hasContainer) {
    return (
      <div className="px-5 pt-5">
        {content}
      </div>
    );
  }

  return content;
}
