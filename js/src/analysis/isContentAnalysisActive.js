var getL10nObject = require( "./getL10nObject" );

import { isUndefined } from "lodash-es";

/**
 * Returns whether or not the content analysis is active
 *
 * @returns {boolean} Whether or not the content analysis is active.
 */
function isContentAnalysisActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.contentAnalysisActive === 1;
}

module.exports = isContentAnalysisActive;
