import getLanguage from "../../languageProcessing/helpers/language/getLanguage";
import wordCountInText from "./wordCountInText.js";
import imageCount from "./imageCount.js";

/**
 * Calculates the expected reading time of a text.
 *
 * @param {Paper} paper The paper to calculate the reading time for.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {number} The expected reading time in minutes for a given language.
 */
export default function( paper, researcher ) {
	const language = getLanguage( paper.getLocale() );

	// A helper to get words from the text for languages that don't use the default approach.
	const customGetWords = researcher.getHelper( "getWordsCustomHelper" );
	const countCharactersFromArray = researcher.getHelper( "wordsCharacterCount" );

	/*
	 * These numbers (both in `wordsPerMinute` and `charactersPerMinute`) are based on research into average reading times:
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
		nl: 202,
		pl: 166,
		pt: 181,
		ru: 184,
		sl: 180,
		sv: 199,
		tr: 166,
	};

	const charactersPerMinute = {
		ja: 357,
	};


	const wordsPerMinuteScore = wordsPerMinute[ language ];
	const charactersPerMinuteScore = charactersPerMinute[ language ];

	// The default approach of calculating the text length is by counting the words in the text.
	let textLength = wordCountInText( paper ).count;
	let minutesToReadText;

	if ( charactersPerMinuteScore ) {
		/*
		 * If a language has a characters per minute score, we assume that the language also uses a character count helper
		 * for retrieving the text length and a custom helper to get words from the text.
		 */
		textLength = countCharactersFromArray( customGetWords( paper.getText() ) );
		minutesToReadText = textLength / charactersPerMinuteScore;
	} else if ( wordsPerMinuteScore ) {
		minutesToReadText = textLength / wordsPerMinuteScore;
	} else {
		// If the language is not on both lists, assign the average of all language-dependent reading times as the score.
		const sumWordsPerMinute = Object.values( wordsPerMinute ).reduce( ( a, b ) => a + b );
		const sumNumberOfLanguages = Object.keys( wordsPerMinute ).length;
		minutesToReadText = textLength / ( sumWordsPerMinute / sumNumberOfLanguages );
	}

	const minutesPerImage = 0.2;
	const numberOfImages = imageCount( paper );

	/*
	 * This formula is based on the average number of words a person is expected to read per minute,
	 * plus extra time for each image in the text. It returns the expected reading time in whole minutes,
	 * rounded up to the nearest minute.
	 */
	return Math.ceil( minutesToReadText + ( numberOfImages * minutesPerImage ) );
}
