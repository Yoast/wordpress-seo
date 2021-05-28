import { get } from "lodash-es";
import { subscribe, select, dispatch } from "@wordpress/data";

import getL10nObject from "../../analysis/getL10nObject";
import UsedKeywords from "../../analysis/usedKeywords";

/**
 * Initialize used keyword analysis.
 *
 * @returns {void}
 */
export default function initializeUsedKeywords() {
	const localizedData = getL10nObject();
	const scriptUrl     = get(
		window,
		[ "wpseoScriptData", "analysis", "worker", "keywords_assessment_url" ],
		"used-keywords-assessment.js"
	);

	const usedKeywords = new UsedKeywords(
		"get_focus_keyword_usage",
		localizedData,
		dispatch( "yoast-seo/editor" ).runAnalysis,
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
