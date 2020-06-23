import getL10nObject from "./getL10nObject";

import { isUndefined } from "lodash-es";

/**
 * Returns whether or not the word forms analysis is active.
 *
 * @returns {boolean} Whether or not the word forms analysis is active.
 */
function isWordFormRecognitionActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.wordFormRecognitionActive === "1";
}

export default isWordFormRecognitionActive;
