import React from 'react';
import PropTypes from 'prop-types';
import HourBlock from './blocks/Hour';
import ContactBlock from './blocks/Contact';
import ImagesBlock from './blocks/Images';
import WebsiteBlock from './blocks/Website';
import InformationBlock from './blocks/Information';
import CovidBlock from './blocks/Covid19';
import PhoneBlock from './blocks/Phone';
import RecyclingBlock from './blocks/Recycling';

export default class PoiBlockContainer extends React.Component {
  static propTypes = {
    poi: PropTypes.object,
    covid19Enabled: PropTypes.bool,
  }

  render() {
    if (!this.props.poi || !this.props.poi.blocks) {
      return null;
    }
    const blocks = this.props.poi.blocks;
    const hourBlock = blocks.find(b => b.type === 'opening_hours');
    const informationBlock = blocks.find(b => b.type === 'information');
    const phoneBlock = blocks.find(b => b.type === 'phone');
    const websiteBlock = blocks.find(b => b.type === 'website');
    const contactBlock = blocks.find(b => b.type === 'contact');
    const imagesBlock = blocks.find(b => b.type === 'images');
    const recyclingBlock = blocks.find(b => b.type === 'recycling');
    const covidBlock = blocks.find(b => b.type === 'covid19');
    const displayCovidInfo = this.props.covid19Enabled && blocks.find(b => b.type === 'covid19');

    return <div className="poi_panel__info">
      {displayCovidInfo &&
        <CovidBlock block={covidBlock} countryCode={this.props.poi.address.country_code} />
      }
      {hourBlock && <HourBlock block={hourBlock} covid19enabled={!!displayCovidInfo} />}
      {informationBlock && <InformationBlock block={informationBlock} />}
      {phoneBlock && <PhoneBlock block={phoneBlock} />}
      {recyclingBlock && <RecyclingBlock block={recyclingBlock} />}
      {websiteBlock && <WebsiteBlock block={websiteBlock} poi={this.props.poi} />}
      {contactBlock && <ContactBlock block={contactBlock} />}
      {imagesBlock && <ImagesBlock block={imagesBlock} poi={this.props.poi} />}
    </div>;
  }
}
