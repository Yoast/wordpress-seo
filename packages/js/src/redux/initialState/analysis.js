import { get } from "lodash";

const inclusiveLanguageResultsInitialState = {
	results: [],
	overallScore: get( window, "wpseoScriptData.metabox.metadata.inclusive_language_score", 0 ),
};

const readabilityResultsInitialState = {
	results: [],
	overallScore: get( window, "wpseoScriptData.metabox.metadata.content_score", 0 ),
};

const seoResultsInitialState = {
	results: [],
	overallScore: get( window, "wpseoScriptData.metabox.metadata.linkdex", 0 ),
};

const analysis = {
	seo: seoResultsInitialState,
	readability: readabilityResultsInitialState,
	inclusiveLanguage: inclusiveLanguageResultsInitialState,
};

export default analysis;
