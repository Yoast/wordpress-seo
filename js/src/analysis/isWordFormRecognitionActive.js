var getL10nObject = require( "./getL10nObject" );

var isUndefined = require( "lodash/isUndefined" );

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
