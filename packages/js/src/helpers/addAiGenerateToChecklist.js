import { get } from "lodash";

/**
 * Determines if the AI Generate check should be shown.
 *
 * @param {Object} store The Yoast SEO redux store.
 *
 * @returns {boolean} Whether to show the AI Generate check.
 */
export function shouldShowAiGenerateCheck( store ) {
	const { isRecentSeoTitlesDefault, isRecentSeoDescriptionsDefault } = store.getPreferences();
	const snippetEditorData = store.getSnippetEditorData();
	const titleDefaultTemplate = get( window, "wpseoScriptData.metabox.title_template", "" );
	const descriptionDefaultTemplate = get( window, "wpseoScriptData.metabox.metadesc_template", "" );

	console.log( "isRecentSeoTitlesDefault:", isRecentSeoTitlesDefault );
	console.log( "isRecentSeoDescriptionsDefault:", isRecentSeoDescriptionsDefault );

	if ( ! isRecentSeoTitlesDefault && ! isRecentSeoDescriptionsDefault ) {
		return false;
	}

	if ( snippetEditorData.title.trim() === titleDefaultTemplate.trim() ) {
		return true;
	}

	if ( snippetEditorData.description.trim() === descriptionDefaultTemplate.trim() ) {
		return true;
	}
}
