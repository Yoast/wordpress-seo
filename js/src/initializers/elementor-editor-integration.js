import { registerReactComponent, renderReactRoot } from "../helpers/reactRoot";

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @param {Object} store The Yoast editor store.
 *
 * @returns {void}
 */
export default function initElementEditorIntegration( store ) {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;
	renderReactRoot( store );
}
