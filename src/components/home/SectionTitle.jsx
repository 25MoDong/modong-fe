export default function SectionTitle({ 
  title, 
  subtitle,
  className='',
}) {
  return (
    <div className={`mt-5 ${className}`}>
      <div className="text-[16px] font-semibold">{title}</div>
      {subtitle && (
        <div className="mt-1 text-[12px] text-gray-500">{subtitle}</div>
      )}
    </div>
  );
}
