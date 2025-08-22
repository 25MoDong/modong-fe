import { useEffect, useState } from 'react';
import LoadingAnimation from '../common/LoadingAnimation';

const Loading = ({ onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState('first'); // 'first', 'second'
  
  useEffect(() => {
    // 첫 번째 애니메이션 완료 후 두 번째 애니메이션 시작 (더 늦게 시작)
    const firstPhaseTimer = setTimeout(() => {
      setAnimationPhase('second');
    }, 4000);
    
    // 전체 애니메이션 완료 (찌그러지는 애니메이션을 충분히 볼 시간 확보)
    const totalAnimationTimer = setTimeout(() => {
      onComplete();
    }, 11000);

    return () => {
      clearTimeout(firstPhaseTimer);
      clearTimeout(totalAnimationTimer);
    };
  }, [onComplete]);

  const text = '돌아다니면서 맹글어보는';

  return (
    <div className="relative w-full h-screen bg-white">
      {/* 중앙 컨테이너 - 아이콘과 텍스트 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* 돌맹이 애니메이션 - 즉시 시작 */}
        <div className="relative">
          <LoadingAnimation 
            size="w-[89px] h-[75px]"
          />
        </div>

        {/* 텍스트 - 두 단계 애니메이션 */}
        <div className="flex flex-col items-center justify-center whitespace-nowrap">
          <p className='text-3xl font-bold mb-2'>돌맹돌맹</p>
          <div className="text-xl font-medium mb-2 relative">
            {text.split('').map((char, index) => {
              const isFirstPhase = animationPhase === 'first';
              const isSecondPhase = animationPhase === 'second';
              
              // 첫 번째 애니메이션 클래스
              let firstAnimationClass = '';
              if (char === '돌') {
                firstAnimationClass = 'animate-char-wave-dol';
              } else if (char === '맹') {
                firstAnimationClass = 'animate-char-wave-maeng';
              } else if (char !== ' ') {
                firstAnimationClass = 'animate-char-wave';
              }
              
              // 두 번째 애니메이션 클래스 - '돌'과 '맹'에만 찌그러짐 효과만 적용 (char-wave 없음)
              let secondAnimationClass = '';
              let characterColor = '';
              if (isSecondPhase) {
                if (char === '돌') {
                  secondAnimationClass = 'animate-char-squash';
                  characterColor = 'text-[#5C7CFF]'; // 돌 하이라이트 색상 유지
                } else if (char === '맹') {
                  secondAnimationClass = 'animate-char-squash';
                  characterColor = 'text-[#5C7CFF]'; // 맹 하이라이트 색상 유지
                }
                // 일반 글자들은 기존 색상 유지, 추가 애니메이션 없음
              }
              
              return (
                <span
                  key={index}
                  className={`
                    inline-block relative transform-origin-bottom
                    ${char === ' ' ? 'w-2' : ''} 
                    ${isFirstPhase ? `opacity-0 ${firstAnimationClass}` : ''}
                    ${isSecondPhase ? `${secondAnimationClass} ${characterColor}` : ''}
                  `}
                  style={{
                    '--delay': `${index * 0.075}s`,
                    '--drop-delay': `${2.4 + index * 0.1}s`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                  
                  {/* 회색 점 - '돌'과 '맹' 글자에만 표시 */}
                  {isSecondPhase && (char === '돌' || char === '맹') && (
                    <div
                      className="absolute w-2 h-2 bg-gray-400 rounded-full animate-drop-dot"
                      style={{
                        top: '-15px',
                        left: '50%',
                        transformOrigin: 'center',
                        '--drop-delay': `${2.4 + index * 0.1}s`,
                      }}
                    />
                  )}
                </span>
              );
            })}
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
