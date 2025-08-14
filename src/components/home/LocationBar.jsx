export default function LocationBar({ text = '정릉로 77', onClick }) {
  return (
    <div className="px-5 pt-5">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1 text-[15px] font-semibold"
      >
        {text}
        <span className="text-gray-500">▼</span>
      </button>
    </div>
  );
}
