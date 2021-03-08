import getL10nObject from "./getL10nObject";

import { get } from "lodash-es";

/**
 * Returns whether or not the cornerstone content is active
 *
 * @returns {boolean} Whether or not the cornerstone content is active.
 */
export default function isCornerstoneContentActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "cornerstoneActive", 0 ) === 1;
}
