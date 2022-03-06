/* Internal dependencies */
import { registerReactComponent, renderClassicEditorMetabox } from "../helpers/classicEditor";
import { isWordProofIntegrationActive } from "../helpers/wordproof";

/* External dependencies */
import wordproofInitializeClassicEditor from "../../../../vendor/wordproof/wordpress-sdk/resources/js/initializers/classicEditor";

/**
 * Initializes the Yoast Classic editor integration.
 *
 * @param {Object} store The Yoast editor store.
 *
 * @returns {void}
 */
export default function initClassicEditorIntegration( store ) {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;
	renderClassicEditorMetabox( store );

	if ( isWordProofIntegrationActive() ) {
		wordproofInitializeClassicEditor();
	}
}
