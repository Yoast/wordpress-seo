/* global $e, elementor */
import { renderYoastTabReactContent } from "./render-sidebar";

/**
 * Adds Yoast SEO as a menu item to the More group.
 * @returns {void}
 */
export const addPanelMenuItem = () => {
	elementor?.getPanelView?.()?.getPages?.( "menu" )?.view?.addItem?.( {
		name: "yoast",
		icon: "yoast yoast-element-menu-icon",
		title: "Yoast SEO",
		type: "page",
		callback: () => {
			try {
				$e.route( "panel/page-settings/yoast-tab" );
			} catch ( error ) {
				// The yoast tab is only available if the page settings has been visited.
				$e.route( "panel/page-settings/settings" );
				$e.route( "panel/page-settings/yoast-tab" );
			}
			// Start rendering the Yoast tab React content.
			renderYoastTabReactContent();
		},
	}, "more" );
};
