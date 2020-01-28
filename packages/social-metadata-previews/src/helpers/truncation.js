// Which symbol should be used for indicating that data was truncated.
const TRUNCATION_SYMBOL = "...";

// How many characters fit on one line.
// This is an approximation because actually calculating the width of an (rendered) element is a lot of work.
const MAX_CHARS = 148;
const MAX_CHARS_ONE_LINE = MAX_CHARS / 2;

/**
 * Truncates a piece of text to a predefined. It also adds a truncation symbol to indicate that truncation happened.
 *
 * The length of truncation is based on two variables:
 *  - type If the type is title, we always truncate the text to one line.
 *  - large If the type is not "title", we check whether it is a large description that has one additional line.
 *
 * @param {string} text The text that is truncated.
 * @param {number|null} maximum Optional: a specified maximum length.
 * @param {string} type Optional: The type of text.
 * @param {boolean} large Optional: indication whether the text should be large.
 *
 * @returns {string} An truncated string if the input was too long, otherwise the string is returned unmodified.
 */
export const truncateText = ( text, maximum = null, type = "title", large = false ) => {
	let max = maximum || MAX_CHARS_ONE_LINE;

	// Only overwrite if it is not type title and the maximum has not been set.
	if ( type !== "title" && ! maximum ) {
		max = large ? MAX_CHARS + MAX_CHARS_ONE_LINE : MAX_CHARS;
	}

	// Make sure we always adhere to the max size...
	if ( max - TRUNCATION_SYMBOL.length <= 0 ){
		return text.slice( 0, max );
	}

	if ( text.length > max ) {
		return text.slice( 0, max - TRUNCATION_SYMBOL.length ) + TRUNCATION_SYMBOL;
	}

	return text;
};
