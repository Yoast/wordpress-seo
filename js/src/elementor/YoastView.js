/* global Marionette, elementor */
import { Fragment, unmountComponentAtNode } from "@wordpress/element";
import ElementorSlot from "../components/slots/ElementorSlot";
import ElementorFill from "../containers/ElementorFill";
import { renderReactRoot } from "../helpers/reactRoot";

export default Marionette.ItemView.extend( {
	template: false,
	id: "elementor-panel-yoast",
	className: "yoast-elementor yoast-sidebar-panel",

	initialize() {
		// Hide the search widget.
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		renderReactRoot( window.YoastSEO.store, this.id, (
			<Fragment>
				<ElementorSlot />
				<ElementorFill />
			</Fragment>
		) );
	},

	onDestroy() {
		unmountComponentAtNode( this.$el[0] );
	},
} );
