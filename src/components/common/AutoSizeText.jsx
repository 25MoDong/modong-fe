import { useEffect, useRef, useState } from 'react';

const AutoSizeText = ({ 
  children, 
  className = '', 
  minFontSize = 12, 
  maxFontSize = 22,
  containerWidth = 148,
  containerHeight = 27 
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

      // reset: force single line by default
      el.style.whiteSpace = 'nowrap';
      el.style.letterSpacing = '0px';

      let size = maxFontSize;
      el.style.fontSize = `${size}px`;

      // Try reduce font size to fit single line
      while (size > minFontSize && el.scrollWidth > containerWidth) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }

      // If still overflow horizontally, try tighten letter-spacing
      if (el.scrollWidth > containerWidth) {
        let ls = 0; // px
        while (ls > -6 && el.scrollWidth > containerWidth) {
          ls -= 0.5; // reduce by 0.5px
          el.style.letterSpacing = `${ls}px`;
        }
      }

      // Keep strictly one line: do not allow wrapping.
      // If still overflowing, clamp to minFontSize and apply tighter letter-spacing a bit more.
      if (el.scrollWidth > containerWidth) {
        let fs = size;
        while (fs > minFontSize && el.scrollWidth > containerWidth) {
          fs -= 1;
          el.style.fontSize = `${fs}px`;
        }
        size = fs;
        if (el.scrollWidth > containerWidth) {
          let ls = parseFloat(el.style.letterSpacing) || 0;
          while (ls > -8 && el.scrollWidth > containerWidth) {
            ls -= 0.25;
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
