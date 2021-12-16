import { strings } from "@yoast/helpers";
import measureTextWidth from "../../../helpers/measureTextWidth";
import { selectors } from "@yoast/externals/redux";

import { applyModifications } from "../../initializers/pluggable";

const {
	getBaseUrlFromSettings,
	getContentLocale,
	getEditorDataContent,
	getFocusKeyphrase,
	getSnippetEditorDescriptionWithTemplate,
	getSnippetEditorSlug,
	getSnippetEditorTitleWithTemplate,
	getDateFromSettings,
} = selectors;

/**
 * Gets the analysis data.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The analysis results.
 */
export const getAnalysisData = ( state ) => {
	let title = getSnippetEditorTitleWithTemplate( state );
	let description = getSnippetEditorDescriptionWithTemplate( state );
	let slug = getSnippetEditorSlug( state );
	const baseUrl = getBaseUrlFromSettings( state );

	/*
	 * Process the raw snippet editor data.
	 *
	 * This is based on the combination of:
	 * - @yoast/search-metadata-previews/src/snippet-editor/SnippetEditor.js -> mapDataToMeasurements
	 * - js/src/elementor/containers/SnippetEditor.js -> mapEditorDataToPreview
	 * However, the templates do not need to be stripped because the data should be like on the frontend.
	 */
	title = strings.stripHTMLTags( applyModifications( "data_page_title", title ) );
	description = strings.stripHTMLTags( applyModifications( "data_meta_desc", description ) );
	// Trim whitespace and replace internal whitespaces in the url with dashes.
	slug = slug.trim().replace( /\s+/g, "-" );

	return {
		text: getEditorDataContent( state ),
		title,
		keyword: getFocusKeyphrase( state ),
		description,
		locale: getContentLocale( state ),
		titleWidth: measureTextWidth( title ),
		url: slug,
		permalink: baseUrl + slug,
		date: getDateFromSettings( state ),
	};
};
