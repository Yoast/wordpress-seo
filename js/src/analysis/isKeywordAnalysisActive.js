var getL10nObject = require( "./getL10nObject" );

import { get } from "lodash-es";

/**
 * Returns whether or not the keyword analysis is active
 *
 * @returns {boolean} Whether or not the keyword analysis is active.
 */
function isKeywordAnalysisActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "keywordAnalysisActive", 0 ) === 1;
}

module.exports = isKeywordAnalysisActive;
