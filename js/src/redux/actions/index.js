import {
	setOverallReadabilityScore,
	setOverallSeoScore,
} from "yoast-components";
import AnalysisFields from "../../helpers/fields/AnalysisFields";
import { setBlockIsValid } from "@yoast/schema-blocks";

export * from "./activeMarker";
export * from "./advancedSettings";
export * from "./analysis";
export * from "./cornerstoneContent";
export * from "./editorData";
export * from "./focusKeyword";
export * from "./markerButtons";
export * from "./markerPauseStatus";
export * from "./primaryTaxonomies";
export * from "./schemaTab";
export * from "./SEMrushModal";
export * from "./SEMrushRequest";
export * from "./settings";
export * from "./snippetEditor";
export * from "./twitterEditor";
export * from "./facebookEditor";
export * from "./warning";

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

/*
 * This import fails. Leading to these errors:
 * ```
 * Uncaught TypeError: (0 , _schemaBlocks2.default) is not a function
 * ```
 *
 * ```
 * Uncaught TypeError: Cannot read property 'setBlockIsValid' of undefined
 * ```
 */
export { setBlockIsValid } from "@yoast/schema-blocks";
