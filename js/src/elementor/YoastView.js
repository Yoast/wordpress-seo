/* global Marionette, elementor */
import initPostEdit from "../initializers/post-edit";

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

		const panel = jQuery( "#elementor-panel-yoast" );
		panel.append( jQuery( window.wpseoScriptData.elementor ) );
		// The post scraper checks for this metabox container.
		panel.append( jQuery( "<div id=\"wpseo_meta\"></div>" ) );
		panel.append( jQuery( "<div id=\"wpseo-react-root\"></div>" ) );

		initPostEdit();
	},

	onDestroy() {
		console.log( "hide" );
	},
} );
