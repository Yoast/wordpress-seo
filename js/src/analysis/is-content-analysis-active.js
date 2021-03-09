import getL10nObject from "./get-l10n-object";

import { get } from "lodash-es";

/**
 * Returns whether or not the content analysis is active
 *
 * @returns {boolean} Whether or not the content analysis is active.
 */
export default function isContentAnalysisActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "contentAnalysisActive", 0 ) === 1;
}
