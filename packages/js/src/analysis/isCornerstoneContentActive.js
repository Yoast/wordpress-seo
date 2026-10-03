import getL10nObject from "./getL10nObject";

import { get } from "lodash";

/**
 * Returns whether or not the cornerstone content is active
 *
 * @returns {boolean} Whether or not the cornerstone content is active.
 */
export default function isCornerstoneContentActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "cornerstoneActive", false ) === true;
}
