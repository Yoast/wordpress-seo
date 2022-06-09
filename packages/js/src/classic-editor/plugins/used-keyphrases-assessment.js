import { get } from "lodash-es";
import { addFilter } from "@wordpress/hooks";

import getL10nObject from "../../analysis/getL10nObject";
import UsedKeywords from "../../analysis/usedKeywords";

/**
 * Initializes the used keyphrases assessment.
 *
 * @param {string} usedKeyphrasesEndpoint The endpoint to call to retrieve previously used keyphrases.
 * @param {function} refreshAnalysis The function to call to refresh the analysis.
 *
 * @returns {void}
 */
export default function initializeUsedKeyphrasesAssessment( usedKeyphrasesEndpoint, refreshAnalysis ) {
	const localizedData = getL10nObject();

	if ( ! localizedData.previouslyUsedKeywordActive ) {
		return;
	}

	const scriptUrl = get(
		window,
		[ "wpseoScriptData", "analysis", "worker", "keywords_assessment_url" ],
		"used-keywords-assessment.js"
	);

	const usedKeywords = new UsedKeywords(
		usedKeyphrasesEndpoint,
		localizedData,
		refreshAnalysis,
		scriptUrl
	);
	usedKeywords.init();

	let lastFocusKeyphrase = null;

	addFilter(
		"yoast.seoStore.analysis.processResults",
		"yoast/free/usedKeyphrasesAssessment",
		( results, { keyphrases } ) => {
			if ( keyphrases.focus === lastFocusKeyphrase ) {
				return results;
			}

			usedKeywords.setKeyword( keyphrases.focus.keyphrase );

			lastFocusKeyphrase = keyphrases.focus;

			return results;
		}
	);
}
