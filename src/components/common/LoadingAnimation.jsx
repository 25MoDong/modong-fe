import { useState, useEffect } from 'react';

/**
 * 돌맹이 눈 깜빡임 애니메이션 컴포넌트
 * 제자리에서 눈만 2번 빠르게 깜빡이는 애니메이션
 * 한 번 깜빡임: dolmaeng -> frame2 -> frame3 -> frame2
 */
const LoadingAnimation = ({ size = 'w-16 h-16', className = '' }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  // 한 번 깜빡임 시퀀스: dolmaeng -> frame2 -> frame3 -> frame2

  useEffect(() => {
    let frameIndex = 0;
    let blinkCount = 0;

    const animateEyes = () => {
      // 2번 깜빡임 후 잠시 대기
      if (blinkCount >= 2) {
        setCurrentFrame(0); // dolmaeng.png로 돌아가기
        setTimeout(() => {
          blinkCount = 0;
          frameIndex = 0;
          animateEyes();
        }, 1000); // 1초 대기 후 다시 시작
        return;
      }

      setCurrentFrame(frameIndex);
      frameIndex++;

      if (frameIndex >= BLINK_SEQUENCE.length) {
        frameIndex = 0;
        blinkCount++;
      }

      setTimeout(animateEyes, 150); // 빠른 깜빡임 (150ms 간격)
    };

    animateEyes();
  }, []);

  return (
    <div className={`${size} ${className} relative`}>
      <img
        src={BLINK_SEQUENCE[currentFrame]}
        alt="돌맹이 깜빡임"
        className="w-full h-full object-contain"
        draggable="false"
        style={{
          imageRendering: 'auto',
          WebkitUserDrag: 'none',
        }}
      />
    </div>
  );
};

export default LoadingAnimation;

// External constant to avoid recreating array each render and satisfy eslint deps
const BLINK_SEQUENCE = [
  '/images/dolmaeng.png',
  '/images/frame2.png',
  '/images/frame3.png',
  '/images/frame2.png'
];
