import { getEditorDataContent, getEditorDataTitle } from "./editorData";
import { getFocusKeyphrase } from "./focusKeyPhrase";

/**
 * Gets the analysis data.
 *
 * @param {Object} state The state
 *
 * @returns {Object} The analysis results.
 */
export const getAnalysisData = ( state ) => {
	return {
		text: getEditorDataContent( state ),
		title: getEditorDataTitle( state ),
		keyword: getFocusKeyphrase( state ),
		synonyms: "",
		description: "",
		locale: "",
		titleWidth: 0,
	};
};
