export default function SearchBar({ placeholder = '취향 장소나 메뉴를 입력해 주세요.', onEnter }) {
    return (
      <div className="px-5 mt-3">
        <div className="flex items-center gap-2 rounded-[12px] border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-400">
            <path fill="currentColor" d="M21 20.3L16.7 16a7.5 7.5 0 10-1.3 1.3L20.3 21zM10.5 17a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"/>
          </svg>
          <input
            className="flex-1 outline-none text-sm placeholder:text-gray-400"
            placeholder={placeholder}
            onKeyDown={(e)=>{ if (e.key === 'Enter' && onEnter) onEnter(e.target.value); }}
          />
        </div>
      </div>
    );
  }
  