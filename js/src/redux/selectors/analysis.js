import { get } from "lodash";
import { getEditorDataContent, getEditorDataTitle } from "./editorData";
import { getFocusKeyphrase } from "./focusKeyPhrase";

export const getAnalysisResults = ( state ) => get( state, "analysisResults" );

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
