import React from 'react';
import ReviewScore from 'src/components/ReviewScore';
import OpeningHour from 'src/components/OpeningHour';
import OsmSchedule from 'src/adapters/osm_schedule';
import nconf from '@qwant/nconf-getter';
import PoiTitle from 'src/components/PoiTitle';

const covid19Enabled = (nconf.get().covid19 || {}).enabled;

const PoiPopup = ({ poi }) => {
  const reviews = poi.blocksByType && poi.blocksByType.grades;
  const openingHours = poi.blocksByType && poi.blocksByType.opening_hours;
  const address = poi.address && poi.address.label;

  let displayedInfo = null;
  if (reviews) {
    displayedInfo = <ReviewScore reviews={reviews} poi={poi} />;
  } else if (openingHours && !covid19Enabled) {
    displayedInfo = <OpeningHour
      schedule={new OsmSchedule(openingHours)}
      className="u-text--label"
    />;
  } else if (address) {
    displayedInfo = <span className="poi_popup__address">{address}</span>;
  }

  return <div className="poi_popup">
    <PoiTitle poi={poi} />
    <div>{displayedInfo}</div>
  </div>;
};

export default PoiPopup;
