import { get } from "lodash";

export const analysisInitialState = {
	seo: {
		results: [],
		overallScore: Number( get( window, "wpseoScriptData.metabox.metadata.linkdex", 0 ) ),
	},
	readability: {
		results: [],
	    overallScore: Number( get( window, "wpseoScriptData.metabox.metadata.content_score", 0 ) ),
	},
	inclusiveLanguage: {
		results: [],
	    overallScore: Number( get( window, "wpseoScriptData.metabox.metadata.inclusive_language_score", 0 ) ),
	},
};
