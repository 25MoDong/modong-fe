import React from 'react';
import AutoSizeText from '../common/AutoSizeText.jsx';
import PlaceSelectDropdown from '../common/PlaceSelectDropdown.jsx';

export default function PlaceSelectBox({
  selectedPlace,
  placeSelectOpen,
  setPlaceSelectOpen,
  placeSelectRef,
  onSelectPlace,
}) {
  return (
    <div className="relative w-[165px]">
      <div
        ref={placeSelectRef}
        className="relative w-[165px] h-[44px] bg-secondary-500 rounded-lg px-[7px] py-2 shadow-[0px_0px_3.1px_rgba(0,0,0,0.25)] flex items-center justify-center border-3 border-[#FFC5D2] cursor-pointer hover:bg-secondary-400 transition-colors"
        onClick={() => setPlaceSelectOpen(!placeSelectOpen)}
      >
        <AutoSizeText
          className="font-kcc-hanbit text-black text-center block"
          minFontSize={14}
          maxFontSize={22}
          containerWidth={148}
          containerHeight={27}
        >
          {selectedPlace}
        </AutoSizeText>
      </div>

      <PlaceSelectDropdown
        isOpen={placeSelectOpen}
        onClose={() => setPlaceSelectOpen(false)}
        selectedPlace={selectedPlace}
        onSelectPlace={onSelectPlace}
        containerRef={placeSelectRef}
      />
    </div>
  );
}
