/**
 * Function to check whether this is the last word in the array.
 *
 * This function will error if you provide an empty array.
 *
 * @param {string} word The current word.
 * @param {string[]} words An array of words.
 *
 * @returns {boolean} true if this is the last word in the array, false otherwise.
 */
const isLastWord = ( word, words ) => {
	return word === words[ words.length - 1 ];
};

/**
 * Function to check whether this is the last line.
 *
 * Created to make the if-statements more readable.
 *
 * @param {number} lineNr The current lineNr.
 * @param {number} nrOfLines The maximum number of lines.
 *
 * @returns {boolean} true if it is the last line, false otherwise.
 */
const isLastLine = ( lineNr, nrOfLines ) => {
	return lineNr === nrOfLines;
};

/**
 * Builds a text that fits in the provided maxWidth and numberOfLines.
 * If the text would have been too long, a truncation symbol is added.
 *
 * @param {string} text The text that we want to fit in the provided space.
 * @param {number} maxWidth The maximum number of characters on one line.
 * @param {number} numberOfLines The maximum number of lines that we want.
 *
 * @returns {string} A string that fits the provided specification, possibly with a truncation symbol.
 */
export const buildTruncatedText = ( text, maxWidth = 74, numberOfLines = 3 ) => {
	// Create an array of words in the description.
	const words = text.split( " " );

	let output = "";
	let currentWidth = 0;
	let currentLine = 1;

	for ( const word of words ) {
		// Increment the width of the current line with the length of the word and a space.
		currentWidth += word.length + 1;

		// Case: we need to move to the next line.
		if ( currentWidth >= maxWidth && ! isLastLine( currentLine, numberOfLines ) ) {
			currentWidth = word.length + 1;
			currentLine += 1;
		}

		// Case: the last word fits and we are done.
		if ( isLastWord( word, words ) && currentWidth <= maxWidth + 1 ) {
			output += word;
			break;
		}

		// Case: the current word does not fit on the last line. Add the truncation mark and quit.
		if ( currentWidth + 4 >= maxWidth && isLastLine( currentLine, numberOfLines ) ) {
			output += " ...";
			break;
		}

		// Case: all is well, we can add the word (and a space).
		output += `${ word } `;
	}

	return output;
};
