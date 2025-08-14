export default function HorizontalScroller({ children }) {
  return (
    <div className="mt-3 pl-5">
      <div className="flex gap-3 overflow-x-auto pr-5 no-scrollbar">
        {children}
      </div>
    </div>
  );
}
