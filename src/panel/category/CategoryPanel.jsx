/* global _ */
import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'src/components/ui/Panel';
import PoiItemList from './PoiItemList';
import PoiItemListPlaceholder from './PoiItemListPlaceholder';
import CategoryPanelError from './CategoryPanelError';
import CategoryPanelHeader from './CategoryPanelHeader';
import Telemetry from 'src/libs/telemetry';
import SearchInput from 'src/ui_components/search_input';
import nconf from '@qwant/nconf-getter';
import IdunnPoi from 'src/adapters/poi/idunn_poi';
import CategoryService from 'src/adapters/category_service';
import { getVisibleBbox } from 'src/panel/layouts';
import { fire, listen, unListen } from 'src/libs/customEvents';
import { boundsFromFlatArray, parseBboxString, boundsToString } from 'src/libs/bounds';

const categoryConfig = nconf.get().category;
const MAX_PLACES = Number(categoryConfig.maxPlaces);

export default class CategoryPanel extends React.Component {
  static propTypes = {
    poiFilters: PropTypes.object,
    bbox: PropTypes.string,
  }

  static defaultProps = {
    poiFilters: {},
  }

  state = {
    pois: [],
    dataSource: '',
    initialLoading: true,
  }

  componentDidMount() {
    this.updateSearchBarContent();
    this.mapMoveHandler = listen('map_moveend', this.fetchData);
    window.execOnMapLoaded(() => { this.fitMap(); });
  }

  componentDidUpdate(prevProps) {
    this.updateSearchBarContent(prevProps);

    const panelContent = document.querySelector('.panel-content');
    if (panelContent) {
      panelContent.scrollTop = 0;
    }

    if (JSON.stringify(prevProps.poiFilters) !== JSON.stringify(this.props.poiFilters)
     || prevProps.bbox !== this.props.bbox) {
      this.setState({ initialLoading: true }, () => {
        window.execOnMapLoaded(() => { this.fitMap(); });
      });
    }
  }

  updateSearchBarContent(prevProps) {
    const { category, query } = this.props.poiFilters;
    if (category) {
      if (category !== prevProps?.poiFilters?.category) {
        Telemetry.add(Telemetry.POI_CATEGORY_OPEN, null, null, { category });
      }
      const value = CategoryService.getCategoryByName(category)?.getInputValue();
      if (value) {
        SearchInput.setInputValue(value);
      }
    } else if (query) {
      SearchInput.setInputValue(query);
    }
  }

  componentWillUnmount() {
    SearchInput.setInputValue('');
    unListen(this.mapMoveHandler);
  }

  fitMap() {
    if (this.props.bbox) {
      fire('fit_map', parseBboxString(this.props.bbox));
      return;
    }

    if (window.map.mb.isMoving()) {
      /*
        Do not trigger API search and zoom change when the map
        is already moving, to avoid flickering.
        The search will be triggered on moveend.
      */
      return;
    }

    // Apply correct zoom when opening a category
    const currentZoom = window.map.mb.getZoom();

    // Zoom < 5: focus on Paris
    if (currentZoom < 5) {
      window.map.mb.flyTo({ center: [2.35, 48.85], zoom: 12 });
    } else if (currentZoom < 12) { // Zoom < 12: zoom up to zoom 12
      window.map.mb.flyTo({ zoom: 12 });
    } else if (currentZoom > 18) { // Zoom > 18: dezoom to zoom 18
      window.map.mb.flyTo({ zoom: 18 });
    } else {
      // setting the same view still triggers the moveend event
      window.map.mb.jumpTo({ zoom: currentZoom, center: window.map.mb.getCenter() });
    }
  }

  fetchData = async () => {
    const { category, query } = this.props.poiFilters;
    const currentBounds = getVisibleBbox(window.map.mb);

    const extendBbox = this.state.initialLoading;
    const { places, source, bbox: contentBbox, bbox_extended } = await IdunnPoi.poiCategoryLoad(
      boundsToString(currentBounds),
      MAX_PLACES,
      category,
      query,
      extendBbox
    );

    this.setState({
      pois: places,
      dataSource: source,
      initialLoading: false,
    });

    if (bbox_extended && contentBbox) {
      // The returned bbox is sure to contain at least one POI.
      // Extend the current one to include it.
      fire('fit_map', currentBounds.extend(boundsFromFlatArray(contentBbox)), true);
    }

    fire('add_category_markers', places, this.props.poiFilters);
    fire('save_location');
  };

  close = () => {
    window.app.navigateTo('/');
  }

  selectPoi = poi => {
    const { poiFilters } = this.props;
    const { pois } = this.state;
    fire('click_category_poi', { poi, poiFilters, pois });
  }

  highlightPoiMarker = (poi, highlight) => {
    fire('highlight_category_marker', poi, highlight);
  }

  render() {
    const { initialLoading, pois, dataSource } = this.state;

    let panelContent;

    if (initialLoading) {
      panelContent = <PoiItemListPlaceholder />;
    } else {
      const hasError = !pois || pois.length === 0;
      const zoomIn = !pois;

      if (hasError) {
        panelContent = <CategoryPanelError zoomIn={zoomIn} />;
      } else {
        panelContent = <PoiItemList
          pois={pois}
          selectPoi={this.selectPoi}
          highlightMarker={this.highlightPoiMarker}
        />;
      }
    }

    return <Panel
      resizable
      title={<CategoryPanelHeader dataSource={dataSource} loading={initialLoading} />}
      minimizedTitle={_('Show results', 'categories')}
      close={this.close}
      className="category__panel"
    >
      {panelContent}
    </Panel>;
  }
}
