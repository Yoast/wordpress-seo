import {
	setOverallReadabilityScore,
	setOverallSeoScore,
} from "yoast-components";
import AnalysisFields from "../../helpers/fields/AnalysisFields";

export * from "./activeMarker";
export * from "./advancedSettings";
export * from "./analysis";
export * from "./cornerstoneContent";
export * from "./editorData";
export * from "./editorModals";
export * from "./estimatedReadingTime";
export * from "./focusKeyword";
export * from "./markerButtons";
export * from "./markerPauseStatus";
export * from "./dismissedAlerts";
export * from "./primaryTaxonomies";
export * from "./schemaTab";
export * from "./SEMrushModal";
export * from "./SEMrushRequest";
export * from "./settings";
export * from "./shoppingData";
export * from "./snippetEditor";
export * from "./twitterEditor";
export * from "./facebookEditor";
export * from "./warning";
export * from "./WincherModal";
export * from "./WincherRequest";
export * from "./WincherSEOPerformance";
export * from "./isPremium";

/**
 * A wrapper function so that we can wrap the field helper to the monorepo action.
 *
 * @param {string} readabilityScore The overall readability score.
 *
 * @returns {Object} A set overall readability score action.
 */
const wrappedSetReadabilityScore = ( readabilityScore ) => {
	AnalysisFields.readabilityScore = readabilityScore;
	return setOverallReadabilityScore( readabilityScore );
};

/**
 * A wrapper function so that we can wrap the field helper to the monorepo action.
 *
 * @param {string} seoScore The overall seo score.
 * @param {string} keyword The keyword for which this score was calculated.
 *
 * @returns {Object} A set overall seo score action.
 */
const wrappedSetSeoScore = ( seoScore, keyword ) => {
	AnalysisFields.seoScore = seoScore;
	return setOverallSeoScore( seoScore, keyword );
};

export { wrappedSetReadabilityScore as setOverallReadabilityScore };
export { wrappedSetSeoScore as setOverallSeoScore };

export {
	setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components";
