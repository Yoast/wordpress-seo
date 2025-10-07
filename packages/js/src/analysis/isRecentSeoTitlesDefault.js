import getL10nObject from "./getL10nObject";

import { get } from "lodash";

/**
 * Returns whether or not the recent SEO titles are default ones.
 *
 * @returns {boolean} Whether or not the recent SEO titles are default ones.
 */
export default function isRecentSeoTitlesDefault() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "recentDefaultSeoTitles", false ) === true;
}
