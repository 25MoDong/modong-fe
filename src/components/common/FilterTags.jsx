/**
 * 홈 페이지 상단 필터 태그 컴포넌트
 * - 테두리가 있는 큰 태그 스타일
 * - 선택 상태에 따라 배경색 변경 가능
 * - # 접두사 포함
 */

const FilterTag = ({ 
  children, 
  isSelected = false, 
  onClick, 
  className = "" 
}) => (
  <div 
    className={`inline-flex items-center justify-center border-2 border-primary-400 rounded-[15px] px-[11px] py-[6px] cursor-pointer hover:bg-primary-50 transition-colors ${
      isSelected 
        ? 'bg-[#F5F5F5]' 
        : 'bg-white'
    } ${className}`}
    onClick={onClick}
  >
    <span className="text-[13px] font-semibold text-primary-500 whitespace-nowrap">
      # {children}
    </span>
  </div>
);

const FilterTags = ({ 
  tags = [], 
  selectedTag = null,
  onTagSelect,
  className = "",
  gap = "gap-2" 
}) => {
  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {tags.map((tag, index) => (
        <FilterTag
          key={index}
          isSelected={selectedTag === tag}
          onClick={() => onTagSelect?.(tag)}
        >
          {tag}
        </FilterTag>
      ))}
    </div>
  );
};

export default FilterTags;
export { FilterTag };