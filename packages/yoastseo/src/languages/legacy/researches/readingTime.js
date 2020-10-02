import wordCountInText from "./wordCountInText.js";
import imageCount from "./imageCountInText.js";

/**
 * Calculates the expected reading time of a text.
 *
 * @param {Paper} paper The paper to calculate the reading time for.
 * @returns {number} The expected reading time in minutes.
 */
export default function( paper ) {
	// These numbers are based on research into average reading times.
	const wordsPerMinute = 200;
	const minutesPerImage = 0.2;

	const numberOfWords = wordCountInText( paper );
	const numberOfImages = imageCount( paper );

	/*
	 * This formula is based on the average number of words a person is expected to read per minute,
	 * plus extra time for each image in the text. It returns the expected reading time in whole minutes,
	 * rounded up to the nearest minute.
	 */
	return Math.ceil( ( numberOfWords / wordsPerMinute ) + ( numberOfImages * minutesPerImage ) );
}
