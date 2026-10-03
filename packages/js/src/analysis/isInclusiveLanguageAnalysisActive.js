import getL10nObject from "./getL10nObject";

import { get } from "lodash";

/**
 * Returns whether or not the inclusive language analysis is active
 *
 * @returns {boolean} Whether or not the inclusive language analysis is active.
 */
export default function isInclusiveLanguageAnalysisActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "inclusiveLanguageAnalysisActive", false ) === true;
}
