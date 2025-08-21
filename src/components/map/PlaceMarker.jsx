import { memo } from 'react';
import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { getMarkerColor, createPlaceMarkerContent, createClusterMarkerContent } from '../../lib/mapUtils';

/**
 * Individual place marker component
 * @param {Object} props
 * @param {Object} props.place - Place data or cluster data
 * @param {boolean} props.isSelected - Whether this marker is selected
 * @param {Function} props.onClick - Click handler
 */
const PlaceMarker = memo(function PlaceMarker({ place, isSelected, onClick }) {
  const handleClick = () => {
    onClick && onClick(place);
  };

  // Handle cluster markers
  if (place.isCluster) {
    return (
      <CustomOverlayMap
        position={place.coordinates}
        yAnchor={0.5}
        xAnchor={0.5}
        zIndex={50}
      >
        <div
          onClick={handleClick}
          style={{
            cursor: 'pointer',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            position: 'relative'
          }}
          dangerouslySetInnerHTML={{
            __html: createClusterMarkerContent(
              place.count,
              getMarkerColor(place.places[0]?.category)
            )
          }}
        />
      </CustomOverlayMap>
    );
  }

  // Handle individual place markers
  return (
    <CustomOverlayMap
      position={place.coordinates}
      yAnchor={0.5}
      xAnchor={0.5}
      zIndex={isSelected ? 100 : 10}
    >
      <div
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          transform: 'translate(-50%, -50%)',
          zIndex: isSelected ? 100 : 10,
          position: 'relative'
        }}
        dangerouslySetInnerHTML={{
          __html: createPlaceMarkerContent(place, isSelected)
        }}
      />
    </CustomOverlayMap>
  );
});

export default PlaceMarker;