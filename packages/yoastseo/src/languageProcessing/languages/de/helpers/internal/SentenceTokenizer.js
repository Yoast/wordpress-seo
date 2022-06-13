// Import { normalize as normalizeQuotes } from "../../../../helpers/sanitize/quotes.js";
import SentenceTokenizer from "../../../../helpers/sentence/SentenceTokenizer";
import wordBoundaries from "../../../../../config/wordBoundaries";

// The beginning of a string (^) or one of the wordboundaries from the wordBoundaries helper.
const wordBoundariesForRegex = "(^|[" + wordBoundaries().map( ( boundary ) => "\\" + boundary ).join( "" ) + "])";
const ordinalDotRegex = new RegExp( wordBoundariesForRegex + "\\d{1,3}\.$" );

/**
 * Class for tokenizing a (html) text into sentences.
 */
export default class GermanSentenceTokenizer extends SentenceTokenizer {
	/**
	 * Constructor
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Checks whether a fullstop is an ordinal dot instead of a sentence splitter.
	 * See: https://en.wikipedia.org/wiki/Ordinal_indicator#Ordinal_dot
	 *
	 * @param {string} currentSentence A string ending with a full stop.
	 * @returns {boolean} Returns true if the full stop is an ordinal dot, false otherwise.
	 */
	endsWithOrdinalDot( currentSentence ) {
		return ordinalDotRegex.test( currentSentence.trim() );
	}
}

