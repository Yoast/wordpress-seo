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

	/*
	 * These numbers are based on research into average reading times:
	 * Susanne Trauzettel-Klosinski, Klaus Dietz, the IReST Study Group;
	 * Standardized Assessment of Reading Performance: The New International Reading Speed Texts IReST.
	 * Invest. Ophthalmol. Vis. Sci. 2012;53(9):5452-5461
	 */
	const wordsPerMinute = {
		ar: 138,
		cn: 158,
		de: 179,
		en: 228,
		es: 218,
		fi: 161,
		fr: 195,
		he: 187,
		it: 188,
		ja: 193,
		nl: 202,
		pl: 166,
		pt: 181,
		ru: 184,
		sl: 180,
		sv: 199,
		tr: 166,
	};
	const minutesPerImage = 0.2;
	const sumWordsPerMinute = Object.values( wordsPerMinute ).reduce( ( a, b ) => a + b );
	const sumNumberOfLanguages = Object.keys( wordsPerMinute ).length;

	let wordsPerMinuteScore = wordsPerMinute[ language ];

	// If the language is not on the list, assign the average of wordPerMinute as the score.
	if ( ! wordsPerMinuteScore ) {
		wordsPerMinuteScore = sumWordsPerMinute / sumNumberOfLanguages;
	}

	const numberOfWords = wordCountInText( paper );
	const numberOfImages = imageCount( paper );

	/*
	 * This formula is based on the average number of words a person is expected to read per minute,
	 * plus extra time for each image in the text. It returns the expected reading time in whole minutes,
	 * rounded up to the nearest minute.
	 */
	return Math.ceil( ( numberOfWords / wordsPerMinuteScore ) + ( numberOfImages * minutesPerImage ) );
}
