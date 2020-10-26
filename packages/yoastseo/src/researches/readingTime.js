import getLanguage from "../helpers/getLanguage";
import wordCountInText from "./wordCountInText.js";
import imageCount from "./imageCountInText.js";

/**
 * Calculates the expected reading time of a text.
 *
 * @param {Paper} paper The paper to calculate the reading time for.
 * @returns {number|null} The expected reading time in minutes or null if we don't have reading time configuration for a given language.
 */
export default function( paper ) {
	const language = getLanguage( paper.getLocale() );

	// These numbers are based on research into average reading times.
	const wordsPerMinute = {
		en: 200,
	};
	const minutesPerImage = 0.2;

	if ( ! wordsPerMinute[ language ] ) {
		return null;
	}


	const numberOfWords = wordCountInText( paper );
	const numberOfImages = imageCount( paper );

	/*
	 * This formula is based on the average number of words a person is expected to read per minute,
	 * plus extra time for each image in the text. It returns the expected reading time in whole minutes,
	 * rounded up to the nearest minute.
	 */
	return Math.ceil( ( numberOfWords / wordsPerMinute[ language ] ) + ( numberOfImages * minutesPerImage ) );
}
