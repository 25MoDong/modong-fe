import { X, Plus, Check } from 'lucide-react';

export default function FavoritesPickerSheet({
  open,
  onClose,
  collections = [],
  selectedIds = [],
  onToggle,          // (id) => void
  onCreateNew,       // () => void
  onSave,            // () => void
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* dim */}
      <button
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 z-0 bg-black/30"
      />
      {/* sheet */}
      <div className="
          relative z-10 mt-0 w-full
          max-w-[400px] min-w-[360px]  /* Layout과 유사한 폭 */
          rounded-t-[20px] bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.12)]
          overflow-hidden
        "
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-[#1B2340]">
            찜할 보석함 선택
          </h3>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-3">
          {/* 새 보석함 만들기 */}
          <button
            onClick={onCreateNew}
            className="
              mb-2 flex w-full items-center gap-2 rounded-lg border border-gray-200
              bg-white px-3 py-2 text-left text-[14px] text-[#1B2340]
              hover:bg-gray-50
            "
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-100">
              <Plus size={14} />
            </span>
            새 돌멩이 보석함 만들기
          </button>

          {/* 보석함 리스트 */}
          <ul className="divide-y divide-gray-100">
            {collections.map((c) => {
              const checked = selectedIds.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => onToggle?.(c.id)}
                    className="flex w-full items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* 선택 원형 토글 */}
                      <span
                        className={[
                          "grid h-6 w-6 place-items-center rounded-full border",
                          checked
                            ? "border-[#3C4462] bg-[#3C4462]"
                            : "border-gray-300 bg-white",
                        ].join(" ")}
                      >
                        {checked ? <Check size={14} className="text-white" /> : null}
                      </span>
                      <div className="text-left">
                        <div className="text-[14px] text-[#1B2340]">{c.title}</div>
                        {typeof c.count === "number" ? (
                          <div className="text-[11px] text-gray-500">
                            포함된 장소 {c.count}개
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 하단 고정 저장 버튼 (safe-area 대응) */}
        <div className="sticky bottom-0 bg-white px-5 pb-[env(safe-area-inset-bottom)] pt-3">
          <button
            onClick={onSave}
            className="mb-3 w-full rounded-lg bg-[#3C4462] py-2 text-[14px] font-semibold text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
