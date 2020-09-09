/* global Marionette, elementor */
import { setElementorTarget } from "../redux/actions/settings";

export default Marionette.ItemView.extend( {
	template: false,
	id: "elementor-panel-yoast",
	className: "yoast-elementor yoast-sidebar-panel",

	initialize() {
		console.log( "init" );

		// Hide the widget search.
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		console.log( "onShow" );

		window.wp.data.dispatch( "yoast-seo/editor" ).setElementorTarget( "elementor-yoast-panel" );
	},

	onDestroy() {
		console.log( "hide" );

		window.wp.data.dispatch( "yoast-seo/editor" ).setElementorTarget( "" );
	},
} );
