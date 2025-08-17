// src/components/favorites/CollectionCard.jsx
export default function CollectionCard({ title, count = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl bg-gray-200/70 p-3 text-left"
    >
      {/* 2x2 placeholder grid */}
      <div className="grid grid-cols-2 gap-1 rounded-md bg-white/50 p-1">
        <div className="aspect-square rounded-md bg-gray-200" />
        <div className="aspect-square rounded-md bg-gray-200" />
        <div className="aspect-square rounded-md bg-gray-200" />
        <div className="aspect-square rounded-md bg-gray-200" />
      </div>

      <p className="mt-2 text-sm font-medium text-gray-800">
        {title}
        {count ? <span className="ml-1 text-gray-500">({count})</span> : null}
      </p>
    </button>
  );
}
