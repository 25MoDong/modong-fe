import { useEffect, useRef, useState } from 'react';

const AutoSizeText = ({ 
  children, 
  className = '', 
  minFontSize = 12, 
  maxFontSize = 22,
  containerWidth = 148,
  containerHeight = 27,
  allowWrap = false
}) => {
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const adjust = () => {
      if (!textRef.current) return;
      const el = textRef.current;

      // enforce measurement constraints so scrollWidth/scrollHeight reflect container
      el.style.boxSizing = 'border-box';
      el.style.width = `${containerWidth}px`;
      el.style.display = 'inline-block';
      el.style.overflow = 'hidden';

          // reset
      el.style.letterSpacing = '0px';
      let size = maxFontSize;
      el.style.fontSize = `${size}px`;

      if (!allowWrap) {
        // single-line mode (legacy behavior)
        el.style.whiteSpace = 'nowrap';
        // Try reduce font size to fit single line
        while (size > minFontSize && el.scrollWidth > containerWidth) {
          size -= 1;
          el.style.fontSize = `${size}px`;
        }

        // try tighten letter-spacing if still overflow
        if (el.scrollWidth > containerWidth) {
          let ls = 0;
          while (ls > -6 && el.scrollWidth > containerWidth) {
            ls -= 0.5;
            el.style.letterSpacing = `${ls}px`;
          }
        }
      } else {
        // multi-line mode: allow wrapping and ensure content fits container height/width
        el.style.whiteSpace = 'normal';
        // loop reduce font size until both dimensions fit
        while (size > minFontSize && (el.scrollWidth > containerWidth || el.scrollHeight > containerHeight)) {
          size -= 1;
          el.style.fontSize = `${size}px`;
        }
        // if still overflowing horizontally, tighten letter-spacing a bit
        if (el.scrollWidth > containerWidth) {
          let ls = 0;
          while (ls > -6 && el.scrollWidth > containerWidth) {
            ls -= 0.5;
            el.style.letterSpacing = `${ls}px`;
          }
        }
      }

      setFontSize(size);
    };

    adjust();
    const observer = new MutationObserver(adjust);
    if (textRef.current) observer.observe(textRef.current, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', adjust);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', adjust);
    };
  }, [children, minFontSize, maxFontSize, containerWidth, containerHeight]);

  return (
    <span
      ref={textRef}
      className={className}
      style={{ 
        fontSize: `${fontSize}px`,
        lineHeight: '1.2'
      }}
    >
      {children}
    </span>
  );
};

export default AutoSizeText;
