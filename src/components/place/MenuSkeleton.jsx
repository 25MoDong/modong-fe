export default function MenuSkeleton({ label = '바나나 푸딩' }) {
  return (
    <div className="shrink-0 w-[72px]">
      <div className="w-[72px] h-[108px] rounded-[10px] bg-gray-200" />
      <p className="mt-2 text-[12px] leading-[14px] text-gray-600 truncate text-center">
        {label}
      </p>
    </div>
  );
}
