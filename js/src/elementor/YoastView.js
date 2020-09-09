/* global Marionette, elementor */
import { createElement, render, unmountComponentAtNode } from "@wordpress/element";
import ElementorSlot from "../components/slots/ElementorSlot";

export default Marionette.ItemView.extend( {
	template: false,
	id: "elementor-panel-yoast",
	className: "yoast-elementor yoast-sidebar-panel",

	initialize() {
		console.log( "init" );

		this.element = createElement( ElementorSlot );

		// Hide the widget search.
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		console.log( "onShow" );

		render( this.element, document.getElementById( "elementor-panel-yoast" ) );
	},

	onDestroy() {
		console.log( "hide" );

		unmountComponentAtNode( document.getElementById( "elementor-panel-yoast" ) );
	},
} );
