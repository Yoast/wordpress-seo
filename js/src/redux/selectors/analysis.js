import measureTextWidth from "../../helpers/measureTextWidth";
import { getContentLocale } from "./editorContext";
import { getEditorDataContent } from "./editorData";
import { getFocusKeyphrase } from "./focusKeyPhrase";
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
 * Gets the slug.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The slug.
 */
export const getSlug = state => get( state, "snippetEditor.data.slug", "" );

/**
 * Gets the analysis data.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The analysis results.
 */
export const getAnalysisData = ( state ) => {
	const title = getSeoTitle( state );

	return {
		text: getEditorDataContent( state ),
		title,
		keyword: getFocusKeyphrase( state ),
		description: getDescription( state ),
		locale: getContentLocale( state ),
		titleWidth: measureTextWidth( title ),
		url: getSlug( state ),
		permalink: getPermalink( state ),
	};
};
