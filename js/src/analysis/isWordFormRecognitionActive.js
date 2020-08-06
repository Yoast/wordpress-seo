import getL10nObject from "./getL10nObject";

import { get } from "lodash-es";

/**
 * Returns whether or not the word forms analysis is active.
 *
 * @returns {boolean} Whether or not the word forms analysis is active.
 */
function isWordFormRecognitionActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "wordFormRecognitionActive", false );
}

export default isWordFormRecognitionActive;
