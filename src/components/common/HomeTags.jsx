/**
 * 홈 페이지 스타일의 태그 컴포넌트
 * - primary-500 배경에 secondary-500 텍스트
 * - 9px 폰트 크기, 6px 둥근 모서리
 * - 유지보수 용이성을 위해 컴포넌트화
 */

const HomeTag = ({ children, className = "" }) => (
  <div className={`inline-flex bg-primary-500 rounded-[6px] px-2 py-[2px] ${className}`}>
    <span className="text-[9px] font-semibold text-secondary-500 whitespace-nowrap">
      {children}
    </span>
  </div>
);

const HomeTags = ({ 
  tags = [], 
  className = "", 
  maxTags = null,
  gap = "gap-1" 
}) => {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  
  return (
    <div className={`flex flex-wrap ${gap} ${className}`}>
      {displayTags.map((tag, index) => (
        <HomeTag key={index}>
          {tag}
        </HomeTag>
      ))}
    </div>
  );
};

export default HomeTags;
export { HomeTag };