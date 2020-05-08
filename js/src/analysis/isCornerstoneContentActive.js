var getL10nObject = require( "./getL10nObject" );

import { get } from "lodash-es";

/**
 * Returns whether or not the cornerstone content is active
 *
 * @returns {boolean} Whether or not the cornerstone content is active.
 */
function isCornerstoneContentActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "cornerstoneActive", 0 ) === 1;
}

module.exports = isCornerstoneContentActive;
