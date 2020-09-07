/* global Marionette, elementor */
import initializeElementorEdit from "./initializeElementorEdit";

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
		panel.append( jQuery( "<div id=\"wpseo-metabox-root\"></div>" ) );

		console.log( "react root:", jQuery( "#wpseo-metabox-root" ) );

		initializeElementorEdit();
	},

	onDestroy() {
		console.log( "hide" );
	},
} );
