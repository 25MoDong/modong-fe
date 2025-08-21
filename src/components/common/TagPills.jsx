const Pill = ({ children, onClick, isActive = false }) => (
  <button
    onClick={onClick}
    className={`px-[10px] h-[24px] text-[11px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
      isActive 
        ? 'bg-[#E7D9B7] text-white border border-[#E7D9B7]'
        : 'bg-white border border-[#E7D9B7] text-[#E7D9B7] hover:bg-[#E7D9B7]/10'
    }`}
    aria-pressed={isActive}
    aria-label={`${children} ${isActive ? '선택됨' : '선택하기'}`}
  >
    {children}
  </button>
);

export default function TagPills({ 
  tags = ['흐림', '비가주륵주륵', '28도'], 
  current = null, 
  onChange,
  className = ''
}) {
  return (
    <div className={`flex gap-[8px] ${className}`}>
      {tags.map(tag => (
        <Pill
          key={tag}
          isActive={current === tag}
          onClick={() => onChange?.(tag)}
        >
          {tag}
        </Pill>
      ))}
    </div>
  );
}