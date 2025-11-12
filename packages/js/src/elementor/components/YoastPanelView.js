/**
 * External dependencies
 */
import jQuery from "jquery";
import Marionette from "backbone.marionette";

import { showYoastPanelAnalysis } from "../initializers/panel";

export const YoastPanelView = Marionette.ItemView.extend( {
	template: false,
	id: "yoast-elementor-react-panel",
	className: "yoast yoast-elementor-panel__fills",
	initialize() {
		jQuery( "#elementor-panel-elements-search-area" ).hide();
	},
	onShow() {
		showYoastPanelAnalysis();
	},
	onDestroy() {
		jQuery( "#elementor-panel-elements-search-area" ).show();
	},
} );
