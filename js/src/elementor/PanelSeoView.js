/* global Marionette jQuery */
import { createElement, render } from "@wordpress/element";

export default Marionette.ItemView.extend( {
	template: false,
	id: "elementor-panel-yoast",
	className: "yoast-elementor yoast-sidebar-panel",

	initialize() {
		console.log( "init" );
		jQuery( "#elementor-panel-elements-search-area" ).hide();
	},

	onShow() {
		console.log( "onShow" );
		render(
			createElement( () => <div>HALLLOOOO</div> ),
			document.getElementById( "elementor-panel-yoast" ),
		);
	},

	onDestroy() {
		console.log( "hide" );
		jQuery( "#elementor-panel-elements-search-area" ).show();
	},
} );
