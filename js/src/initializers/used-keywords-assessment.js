import { get } from "lodash-es";

import getL10nObject from "../analysis/getL10nObject";
import UsedKeywords from "../analysis/usedKeywords";

/**
 * Initialize used keyword analysis.
 *
 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
 * @param {string}   ajaxAction      The ajax action to use when retrieving the used keywords data.
 * @param {object}   store           The Yoast editor store.
 *
 * @returns {void}
 */
export default function initializeUsedKeywords( refreshAnalysis, ajaxAction, store ) {
	const localizedData = getL10nObject();
	const scriptUrl     = get(
		window,
		[ "wpseoScriptData", "analysis", "worker", "keywords_assessment_url" ],
		"used-keywords-assessment.js"
	);

	const usedKeywords = new UsedKeywords(
		ajaxAction,
		localizedData,
		refreshAnalysis,
		scriptUrl
	);
	usedKeywords.init();

	let lastData = {};
	store.subscribe( () => {
		const state = store.getState() || {};
		if ( state.focusKeyword === lastData.focusKeyword ) {
			return;
		}
		lastData = state;
		usedKeywords.setKeyword( state.focusKeyword );
	} );
}
