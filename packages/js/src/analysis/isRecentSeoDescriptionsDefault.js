import getL10nObject from "./getL10nObject";

import { get } from "lodash";

/**
 * Returns whether or not the recent meta descriptions are default ones.
 *
 * @returns {boolean} Whether or not the recent meta descriptions are default ones.
 */
export default function isRecentSeoDescriptionsDefault() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "recentDefaultSeoDescriptions", false ) === true;
}
