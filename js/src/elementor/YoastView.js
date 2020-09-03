/* global Marionette, elementor */
import { createElement, render } from "@wordpress/element";

export default Marionette.ItemView.extend( {
	template: false,
	id: "elementor-panel-yoast",
	className: "yoast-elementor yoast-sidebar-panel",

	initialize() {
		console.log( "init" );
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		console.log( "onShow" );
		render(
			createElement( () => <div>YAY</div> ),
			document.getElementById( "elementor-panel-yoast" ),
		);
	},

	onDestroy() {
		console.log( "hide" );
	},
} );
