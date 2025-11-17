import jQuery from "jquery";
// eslint-disable-next-line import/no-unresolved
import Marionette from "Marionette";
import { showYoastPanelAnalysis } from "../initializers/panel";

const ELEMENTS_SEARCH_AREA_SELECTOR = "#elementor-panel-elements-search-area";
export const YoastPanelView = Marionette.ItemView.extend( {
	template: false,
	id: "yoast-elementor-react-panel",
	className: "yoast yoast-elementor-panel__fills",
	initialize() {
		jQuery( ELEMENTS_SEARCH_AREA_SELECTOR ).hide();
	},
	onShow() {
		showYoastPanelAnalysis();
	},
	onDestroy() {
		jQuery( ELEMENTS_SEARCH_AREA_SELECTOR ).show();
	},
} );
