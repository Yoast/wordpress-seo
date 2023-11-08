import createPunctuationTokens from "./createPunctuationTokens";

/*
 * The following regex matches a word separator. A word separator is either a whitespace, a tab or a non-breaking space.
 * Brackets are added to deal correctly with shortcodes downstream.
 * The regex is used to split a text into tokens.
 * Do not add punctuation marks to this regex, as they are handled separately inside splitIntoTokens().
 * The word separator explicitly only contains characters that split two words and not a word and a space.
 * - A space is a word separator because it separates two words if it occurs between two words. For example: "foo bar"
 * - A tab is a word separator because it separates two words if it occurs between two words. For example: "foo	bar"
 * - A non-breaking space (u00A0) is a word separator because it separates two words if it occurs between two words. For example: "foo\u00A0bar"
 * - An en-dash (u2013), em-dash (u2014), and hyphen (u002d) are word separators because they separate two words if they occur between two words.
 *   For example: "foo–bar".
 * - Open and closing brackets are added to deal correctly with shortcodes downstream.
 */
const wordSeparatorsRegex = /([\s\t\u00A0\u2013\u2014\u002d[\]])/;

/**
 * Tokenizes a text similar to getWords, but in a suitable way for the HTML parser.
 * 1. It does not normalize whitespace.
 * This operation is too risky for the HTML parser because it may throw away characters and as a result, the token positions are corrupted.
 * 2. It does not remove punctuation marks but keeps them.
 *
 * This algorithm splits the text by word separators: tokens that are the border between two words.
 * This algorithm separates punctuation marks from words and keeps them as separate tokens.
 * It only splits them off if they appear at the start or end of a word.
 *
 * @param {string} text The text to tokenize.
 *
 * @returns {string[]} 	An array of tokens.
 */
const getWordsForHTMLParser = ( text ) => {
	if ( ! text ) {
		return [];
	}

	// Split the sentence string into tokens. Those tokens are unrefined as they may contain punctuation.
	const rawTokens = text.split( wordSeparatorsRegex ).filter( x => x !== "" );

	// Remove punctuation from the beginning and end of word tokens, and make them into separate tokens.
	return createPunctuationTokens( rawTokens );
};

export default getWordsForHTMLParser;
