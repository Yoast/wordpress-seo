import measureTextWidth from "../../helpers/measureTextWidth";
import { getContentLocale } from "./editorContext";
import { getEditorDataContent } from "./editorData";
import { getFocusKeyphrase } from "./focusKeyPhrase";
import { getBaseUrlFromSettings } from "./settings";
import { getSnippetEditorDescription, getSnippetEditorSlug, getSnippetEditorTitle } from "./snippetEditor";
import { get } from "lodash";

/**
 * Gets the SEO title.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The SEO title.
 */
export const getSeoTitle = ( state ) => get( state, "analysisData.snippet.title", "" );

/**
 * Gets the description.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The description.
 */
export const getDescription = ( state ) => get( state, "analysisData.snippet.description", "" );

/**
 * Gets the permalink.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The permalink.
 */
export const getPermalink = ( state ) => get( state, "analysisData.snippet.url", "" );

/**
 * Gets the analysis timestamp.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The analysis timestamp.
 */
export const getAnalysisTimestamp = ( state ) => parseInt( get( state, "analysisData.timestamp", 0 ), 10 );

/**
 * Gets the analysis data.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The analysis results.
 */
export const getAnalysisData = ( state ) => {
	const title = getSeoTitle( state ) || getSnippetEditorTitle( state );
	const slug = getSnippetEditorSlug( state );

	return {
		text: getEditorDataContent( state ),
		title,
		keyword: getFocusKeyphrase( state ),
		description: getDescription( state ) || getSnippetEditorDescription( state ),
		locale: getContentLocale( state ),
		titleWidth: measureTextWidth( title ),
		slug: slug,
		permalink: getBaseUrlFromSettings( state ) + slug,
	};
};
