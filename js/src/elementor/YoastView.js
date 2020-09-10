/* global Marionette, elementor */
import { unmountComponentAtNode } from "@wordpress/element";
import { renderReactRoot } from "../helpers/reactRoot";

export default Marionette.ItemView.extend( {
	template: false,
	id: "elementor-panel-yoast",
	className: "yoast-elementor yoast-sidebar-panel",

	initialize() {
		console.log( "init" );

		// Hide the search widget.
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		console.log( "onShow" );

		renderReactRoot( window.YoastSEO.store, this.id );
	},

	onDestroy() {
		console.log( "hide" );

		unmountComponentAtNode( this.$el[0] );
	},
} );
