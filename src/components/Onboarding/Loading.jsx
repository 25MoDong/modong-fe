import { useEffect } from 'react';

const Loading = ({ onComplete }) => {
  useEffect(() => {
    const animationDuration = 6000;
    const timer = setTimeout(() => {
      onComplete();
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen bg-white">
      {/* 해당 animation 위치: tailwind.config.js */}
      <div className="absolute inset-0 bg-gray-500 animate-circle-shrink" />
      {/* 중앙 컨테이너 - 아이콘과 텍스트 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* 아이콘/돌맹이 */}
        <div className="relative">
          <img 
            src="images/dolmaeng.png" 
            alt="돌맹이미지"
            className='w-[89px] h-[75px]'
          />
          <div className="absolute top-[20px] left-[25px] w-[6px] h-[6px] bg-primary-500 rounded-full animate-blink"></div>
          <div className="absolute top-[20px] left-[35px] w-[6px] h-[6px] bg-primary-500 rounded-full animate-blink"></div>
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col items-center justify-center whitespace-nowrap">
          <div className="text-xl font-medium mb-2">
            {'돌아다니면서 맹글어보는'.split('').map((char, index) => (
              <span
                key={index}
                className={`inline-block opacity-0 ${char === ' ' ? 'w-2' : ''} ${char === '돌' ? 'animate-char-wave-dol' : char === '맹' ? 'animate-char-wave-maeng' : 'animate-char-wave'}`}
                style={{ '--delay': `${1.8 + index * 0.075}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
          <p className="text-xl font-medium animate-sentence-up opacity-0">
            우리 동네 장소 보석함
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
