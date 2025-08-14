const Pill = ({ children, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-[11px] rounded-full border ${
        active ? 'bg-[#F5EEDC] border-[#E7D9B7] text-[#7A6747]' : 'bg-white border-gray-200 text-gray-600'
      }`}
    >
      {children}
    </button>
  );
  
  export default function RecoPills({ current='초보', onChange }) {
    const tabs = ['초보', '내가 좋아할만한', '2번+'];
    return (
      <div className="px-5 mt-3 flex gap-6">
        {tabs.map(t => (
          <Pill key={t} active={t===current} onClick={()=>onChange && onChange(t)}>{t}</Pill>
        ))}
      </div>
    );
  }
  