import React from 'react';
import PlaceSelectBox from './PlaceSelectBox';

export default function MainHighlight({
  selectedPlace,
  placeSelectOpen,
  setPlaceSelectOpen,
  placeSelectRef,
  setSelectedPlace,
}) {
  return (
    <div className="w-[283px] h-[77px] flex flex-col gap-[7px]">
      {/* Frame 39593 - 연남동 밀리커피 영역 */}
      <div className="w-[283px] h-[44px] flex items-center gap-2">
        <PlaceSelectBox
          selectedPlace={selectedPlace}
          placeSelectOpen={placeSelectOpen}
          setPlaceSelectOpen={setPlaceSelectOpen}
          placeSelectRef={placeSelectRef}
          onSelectPlace={setSelectedPlace}
        />
        <span className="font-sans font-semibold text-[22px] text-white whitespace-nowrap w-[106px] h-[26px]">같은 분위기,</span>
      </div>

      {/* 두 번째 라인 - 색상 분리 */}
      <div className="w-[283px] h-[26px] font-sans font-semibold text-[22px]">
        <span className="text-[#FFC5D2]">우리동네</span>
        <span className="text-white">에서도 찾아봤어요!</span>
      </div>
    </div>
  );
}
