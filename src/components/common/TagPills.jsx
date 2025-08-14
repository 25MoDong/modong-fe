const Pill = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className={'px-[10px] h-[24px] text-[11px] rounded-full transition-colors bg-white border border-[#E7D9B7] text-[#E7D9B7]'
    }
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
          onClick={() => onChange?.(tag)}
        >
          {tag}
        </Pill>
      ))}
    </div>
  );
}