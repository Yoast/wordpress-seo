/* global Marionette, elementor */
import { createElement, render } from "@wordpress/element";
import SidebarFill from "../containers/SidebarFill";

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

		render(
			createElement( SidebarFill ),
			document.getElementById( "elementor-panel-yoast" ),
		);
	},

	onDestroy() {
		console.log( "hide" );
	},
} );
