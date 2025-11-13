// eslint-disable-next-line import/no-unresolved
import Marionette from "Marionette";

import { showYoastPanelAnalysis } from "../initializers/panel";

export const YoastPanelView = Marionette.ItemView.extend( {
	template: false,
	id: "yoast-elementor-react-panel",
	className: "yoast yoast-elementor-panel__fills",
	initialize() {
		$( "#elementor-panel-elements-search-area" ).hide();
	},
	onShow() {
		showYoastPanelAnalysis();
	},
	onDestroy() {
		$( "#elementor-panel-elements-search-area" ).show();
	},
} );
