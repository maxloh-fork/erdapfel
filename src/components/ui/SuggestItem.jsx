/* global _ */
import React from 'react';
import NavigatorGeolocalisationPoi from 'src/adapters/poi/specials/navigator_geolocalisation_poi';
import IconManager from '../../adapters/icon_manager';
import Category from 'src/adapters/category';
import Intention from 'src/adapters/intention';
import { format as formatAddress } from '../../libs/address';

const ItemLabels = ({ firstLabel, secondLabel }) =>
  <div className="autocomplete_suggestion__labels">
    <div className="autocomplete_suggestion__first_line">{firstLabel}</div>
    {secondLabel && <div className="autocomplete_suggestion__second_line">{secondLabel}</div>}
  </div>;

const GeolocationItem = () =>
  <div className="autocomplete_suggestion autocomplete_suggestion--geoloc">
    <div className="autocomplete-icon icon-pin_geoloc" />
    <ItemLabels firstLabel={_('Your position', 'direction')} />
  </div>;

const IntentionItem = ({ intention }) => {
  const { category, place, fullTextQuery } = intention;
  const placeString = place
    ? `${_('Close to')} ${place.properties.geocoding.name}`
    : _('Search around this place');

  return <div className="autocomplete_suggestion autocomplete_suggestion--intention">
    <div className="autocomplete-icon" />
    <ItemLabels firstLabel={category?.label || fullTextQuery} secondLabel={placeString} />
  </div>;
};

const CategoryItem = ({ category }) => {
  const { id, label, alternativeName, color, backgroundColor } = category;
  const icon = category.getIcon();

  return (
    <div
      className="autocomplete_suggestion autocomplete_suggestion--category"
      data-id={id}
    >
      <div
        style={{ color, backgroundColor }}
        className={`autocomplete-icon icon icon-${icon.iconClass}`}
      />
      <ItemLabels firstLabel={label} secondLabel={alternativeName} />
    </div>
  );
};

const PoiItem = ({ poi }) => {
  const { name, className, subClassName, type } = poi;
  const icon = IconManager.get({ className, subClassName, type });
  const streetAddress = poi.alternativeName // fallback to alternativeName for older favorites
    ? poi.alternativeName
    : formatAddress(poi.address);

  return (
    <div className="autocomplete_suggestion">
      <div
        style={{ color: icon ? icon.color : '' }}
        className={`autocomplete-icon icon icon-${icon.iconClass}`}
      />
      <ItemLabels firstLabel={name} secondLabel={streetAddress} />
    </div>
  );
};

const SeparatorLabel = ({ label }) =>
  <h3 className="autocomplete_separator_label">
    {label}
  </h3>;

const ErrorLabel = ({ label }) =>
  <div className="autocomplete_error">
    {label}
  </div>;

const SuggestItem = ({ item }) => {
  if (item.simpleLabel) {
    return <SeparatorLabel label={item.simpleLabel} />;
  }

  if (item.errorLabel) {
    return <ErrorLabel label={item.errorLabel} />;
  }

  if (item instanceof NavigatorGeolocalisationPoi) {
    return <GeolocationItem />;
  }

  if (item instanceof Category) {
    return <CategoryItem category={item} />;
  }

  if (item instanceof Intention) {
    return <IntentionItem intention={item} />;
  }

  return <PoiItem poi={item} />;
};

export default SuggestItem;
