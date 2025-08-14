export default function SectionTitle({ title, subtitle }) {
    return (
      <div className="px-5 mt-5">
        <div className="text-[16px] font-semibold">{title}</div>
        {subtitle && <div className="mt-1 text-[12px] text-gray-500">{subtitle}</div>}
      </div>
    );
  }
  