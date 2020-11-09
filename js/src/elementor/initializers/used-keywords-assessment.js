import { get } from "lodash-es";
import { subscribe, select } from "@wordpress/data";

import getL10nObject from "../../analysis/getL10nObject";
import UsedKeywords from "../../analysis/usedKeywords";

/**
 * Initialize used keyword analysis.
 *
 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
 * @param {string}   ajaxAction      The ajax action to use when retrieving the used keywords data.
 *
 * @returns {void}
 */
export default function initializeUsedKeywords( refreshAnalysis, ajaxAction ) {
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

	let lastFocusKeyphrase = "";
	subscribe( () => {
		const focusKeyphrase = select( "yoast-seo/editor" ).getFocusKeyphrase();
		if ( focusKeyphrase === lastFocusKeyphrase ) {
			return;
		}
		lastFocusKeyphrase = focusKeyphrase;
		usedKeywords.setKeyword( focusKeyphrase );
	} );
}
