import { useEffect, useState } from 'react';
import LoadingAnimation from '../common/LoadingAnimation';

const Loading = ({ onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState('first'); // 'first', 'second'
  
  useEffect(() => {
    // sentenceUp timing in tailwind: delay 2.0s, duration 0.65s
    const SENTENCE_UP_DELAY = 2.0; // seconds
    const SENTENCE_UP_DURATION = 0.65; // seconds
    const secondPhaseStartMs = Math.round((SENTENCE_UP_DELAY + SENTENCE_UP_DURATION) * 1000);

    // 두 번째 페이즈는 sentenceUp이 끝난 직후 시작
    const firstPhaseTimer = setTimeout(() => {
      setAnimationPhase('second');
    }, secondPhaseStartMs);

    // 전체 애니메이션 완료 타이밍: 두 번째 페이즈 시작 + 여유 (약 3초)
    const totalAnimationTimer = setTimeout(() => {
      onComplete();
    }, secondPhaseStartMs + 3000);

    return () => {
      clearTimeout(firstPhaseTimer);
      clearTimeout(totalAnimationTimer);
    };
  }, [onComplete]);

  const text = '돌아다니면서 맹글어보는';

  return (
    <div className="relative w-full h-screen bg-secondary-500">
      
  <style>{`@font-face {
    font-family: 'KCC-Hanbit';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2403-2@1.0/KCC-Hanbit.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  .kcc-hanbit { font-family: 'KCC-Hanbit', sans-serif; }`}</style>

      {/* 중앙 컨테이너 - 아이콘과 텍스트 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* 돌맹이 애니메이션 - 즉시 시작 */}
        <div className="relative mb-4">
          <LoadingAnimation 
            size="w-[89px] h-[75px]"
          />
        </div>

        {/* 텍스트 - 두 단계 애니메이션 */}
        <div className="flex flex-col items-center justify-center whitespace-nowrap">
          <p className='text-3xl font-bold mb-6 kcc-hanbit'>돌맹돌맹</p>
          <div className="text-xl font-medium relative">
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
              
              let secondAnimationClass = '';
              let characterColor = '';
              if (char === '돌') {
                secondAnimationClass = 'animate-char-squash';
                characterColor = 'text-[#E07A91]'; 
              } else if (char === '맹') {
                secondAnimationClass = 'animate-char-squash';
                characterColor = 'text-[#E07A91]'; 
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
                    '--drop-delay': `calc(${char === '돌' ? '0s' : char === '맹' ? '0.9s' : '0s'} + ${index * 0.075}s)`,
                    '--char-delay': `calc(${char === '돌' ? '0s' : char === '맹' ? '0.9s' : '0s'} + ${index * 0.075}s)`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                  
                  {/* 회색 점 - 두 번째 페이즈에서만 표시하여 애니메이션 타이밍을 문자 찌그러짐과 동기화 */}
                  {(isSecondPhase && (char === '돌' || char === '맹')) && (
                    <div
                      className="absolute w-2 h-2 bg-gray-400 rounded-full animate-drop-dot opacity-0"
                      style={{
                        top: '-15px',
                        left: '50%',
                        transformOrigin: 'center',
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
