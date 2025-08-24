import AutoSizeText from '../common/AutoSizeText.jsx';

const StatusCard = ({ type, count = 0 }) => {
  const title = type === 'stamp' ? '이번 달 모은 스탬프 개수' : '이번 달 받은 쿠폰 개수';
  return (
    <div className="w-[152px] h-[90px] relative">
      {/* top icon */}
      <div className="absolute left-[7px] top-0 w-[30px] h-[25px]">
        <img src="/images/dolmaeng.png" alt={type === 'stamp' ? '스탬프' : '쿠폰'} className="w-full h-full object-contain" />
      </div>

      {/* background image based card */}
      <div className="absolute left-0 top-[17px] w-[152px] h-[73px]">
        <div className="w-full h-full bg-[url('/images/border/statusCard.png')] bg-contain bg-bottom bg-no-repeat rounded-[10px] p-[10px] box-border relative">
          <div className="mb-[6px] text-center">
            <AutoSizeText
              minFontSize={9}
              maxFontSize={13}
              containerWidth={132}
              containerHeight={18}
              className="font-kcc-hanbit text-black block w-full whitespace-nowrap text-center"
            >
              {title}
            </AutoSizeText>
          </div>
          <div className="text-center">
            <div className="font-extrabold text-[20px] leading-[24px] text-black">{count}개</div>
            <div className="-mt-3 w-[45px] h-[12px] bg-[#FFCEF2] mx-auto rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
