module.exports = {
  events: [
    /* App */
    'app_start',
    /* Suggest*/
    'suggest_selection',
    /* Favorite */
    'favorite_open',
    'favorite_close',
    'favorite_go',
    'favorite_share',
    'favorite_delete',
    'favorite_error_load_all', //error
    /* Itinerary */
    'itinerary_open',
    'itinerary_close',
    'itinerary_share',
    'itinerary_invert',
    'itinerary_mode_driving',
    'itinerary_mode_walking',
    'itinerary_mode_cycling',
    'itinerary_mode_publictransport',
    /* Poi */
    'poi_category_open',
    'poi_backtofavorite',
    'poi_backtolist',
    'poi_restore',
    'poi_share',
    /* OSM */
    'poi_osm_open',
    'poi_osm_go',
    'poi_osm_favorite', // Favorite toggle
    'poi_osm_phone',
    'poi_osm_website',
    /* Pages Jaunes Poi */
    'poi_pages_jaunes_open',
    'poi_pages_jaunes_go',
    'poi_pages_jaunes_favorite', // Favorite toggle
    'poi_pages_jaunes_phone',
    'poi_pages_jaunes_website',
    'poi_pages_jaunes_reviews',
    /* Map */
    'localise_trigger',
    /* Masq */
    'masq_activated',
    'masq_banner_click',
    'masq_banner_close',
    'masq_menu_activate',
    'masq_menu_desactivate',
    'masq_menu_onboarding',
    'masq_menu_open',
    'masq_onboarding_activate',
    'masq_add_poi_modal_activate',
    'masq_add_poi_modal_onboarding',
    'masq_put',
    'masq_del',
    /* Covid-19 */
    'covid_caresteouvert_link',
    'covid_caresteouvert_contribute',
  ],
};
