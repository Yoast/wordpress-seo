import getL10nObject from "./getL10nObject";

import { isUndefined } from "lodash-es";

/**
 * Returns whether or not the content analysis is active
 *
 * @returns {boolean} Whether or not the content analysis is active.
 */
export default function isContentAnalysisActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.contentAnalysisActive === "1";
}
