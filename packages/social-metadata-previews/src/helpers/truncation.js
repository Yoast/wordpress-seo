/**
 * Depending on the number of characters per line, will truncate the sentence on the last line.
 *
 * @param {string} fullText      The text string that needs to be truncated.
 * @param {number} maxWidth      The approximate number of characters per line.
 * @param {number} numberOfLines The number of lines before truncation.
 *
 * @returns {string} The text that would approximately fit on the number of lines with the specified width.
 */
export const buildTruncatedText = ( fullText, maxWidth = 74, numberOfLines = 3 ) => {
	const words = fullText.split( " " );

	/**
	 *
	 * @param {array}    text           The text, split on spaces into an array.
	 * @param {number}   widthRemaining The remaining number of characters on this line.
	 * @param {number}   linesRemaining The remaining number of lines.
	 * @param {string}   output         The truncated string.
	 *
	 * @returns {string} Returns the completed output when done, or calls itself again when not done.
	 */
	const truncateTextRecursively = ( text, widthRemaining = maxWidth, linesRemaining = numberOfLines, output = ""  ) => {
		let toAdd = "";
		// Base cases:

		// If there are no more words to add, return the output we have.
		if ( text.length === 0 ) {
			return output;
		}

		// If there is no more width remaining on this line, go to the next line.
		if ( widthRemaining <= 0 ) {
			return truncateTextRecursively( text, maxWidth, linesRemaining - 1, output + " " );
		}

		// If this is NOT the first word on this line, add a space.
		if ( widthRemaining !== maxWidth ) {
			toAdd +=  " ";
		}

		if ( text[ 0 ].length > maxWidth ) {
			return output + text[ 0 ];
		}

		// Take the word from the array, and add it to the part we are trying to add.
		toAdd += text.splice( 0, 1 );

		/*
		* A pragmatic decision was taken here to not check for sentence endings.
		*
		* We terminate and truncate the text if:
		* 	-Adding this word plus ellipsis would exceed the maximumWidth for this line.
		* 	AND
		* 	-We cannot go to the next line.
		*/
		if ( toAdd.length + 4 >= widthRemaining && linesRemaining === 1 ) {
			return output + " ...";
		}

		// If none of the early returns are triggered: add the word, decrease the width remaining, and stay on this line.
		return truncateTextRecursively( text, widthRemaining - toAdd.length, linesRemaining, output + toAdd );
	};
	return truncateTextRecursively( words );
};
