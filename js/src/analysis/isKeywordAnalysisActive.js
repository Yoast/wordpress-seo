import getL10nObject from "./getL10nObject";

import { get } from "lodash-es";

/**
 * Returns whether or not the keyword analysis is active
 *
 * @returns {boolean} Whether or not the keyword analysis is active.
 */
export default function isKeywordAnalysisActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "keywordAnalysisActive", 0 ) === 1;
}
