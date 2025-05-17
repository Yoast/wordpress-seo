import createPunctuationTokens from "../../../helpers/word/createPunctuationTokens";

/*
 * The following regex matches a word separator. A word separator is either a whitespace, a tab, a non-breaking space,
 * an en-dash or an em-dash.
 * Brackets are added to deal correctly with shortcodes downstream.
 * The regex is used to split a text into tokens.
 * Do not add punctuation marks to this regex, as they are handled separately inside `createPunctuationTokens()`.
 * The word separator explicitly only contains characters that split two words and not a word and a space.
 * - A space is a word separator because it separates two words if it occurs between them. For example: "foo bar"
 * - A tab is a word separator because it separates two words if it occurs between them. For example: "foo	bar"
 * - A non-breaking space (u00A0) is a word separator because it separates two words if it occurs between them. For example: "foo\u00A0bar"
 * - An en-dash (u2013) and an em-dash (u2014) are word separators because they separate two words if they occur between them.
 *   For example: "foo–bar".
 *
 * Hyphens are NOT word separators in Indonesian. They are most often used in a way that doesn't indicate a word boundary,
 * for example for reduplication (e.g. 'buku' meaning 'book' and 'buku-buku' meaning books).
 */
const WORD_SEPARATORS_REGEX = /([\s\t\u00A0\u2013\u2014[\]])/;

/**
 * Tokenizes a text similarly to `getWords`, but in a way that's suitable for the HTML parser.
 * 1. It does not normalize whitespace.
 * This operation is too risky for the HTML parser because it may throw away characters and as a result, the token positions are corrupted.
 * 2. It does not remove punctuation marks but keeps them.
 *
 * This algorithm splits the text by word separators: tokens that are the border between two words.
 * This algorithm separates punctuation marks from words and keeps them as separate tokens.
 * It only splits them off if they appear at the start or the end of a word.
 *
 * @param {string} text The text to tokenize.
 *
 * @returns {string[]} 	An array of tokens.
 */
function splitIntoTokensCustom( text ) {
	if ( ! text ) {
		return [];
	}

	// Split the sentence string into tokens. Those tokens are unrefined as they may contain punctuation.
	const rawTokens = text.split( WORD_SEPARATORS_REGEX ).filter( x => x !== "" );

	// Remove punctuation from the beginning and end of word tokens, and make them into separate tokens.
	return createPunctuationTokens( rawTokens );
}

export default splitIntoTokensCustom;
