import getL10nObject from "./getL10nObject";

import { isUndefined } from "lodash-es";

/**
 * Returns whether or not the cornerstone content is active
 *
 * @returns {boolean} Whether or not the cornerstone content is active.
 */
export default function isCornerstoneContentActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.cornerstoneActive === "1";
}
