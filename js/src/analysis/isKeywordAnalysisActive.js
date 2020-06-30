import getL10nObject from "./getL10nObject";

import { isUndefined } from "lodash-es";

/**
 * Returns whether or not the keyword analysis is active
 *
 * @returns {boolean} Whether or not the keyword analysis is active.
 */
export default function isKeywordAnalysisActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.keywordAnalysisActive === "1";
}
