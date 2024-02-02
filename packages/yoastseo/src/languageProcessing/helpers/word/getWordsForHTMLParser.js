import { punctuationRegexEnd, punctuationRegexStart } from "../sanitize/removePunctuation";
import { hashedHtmlEntitiesRegexEnd, hashedHtmlEntitiesRegexStart } from "../../../helpers/htmlEntities";

/*
 * The following regex is used to split a text into tokens.
 * The regex matches word separators. A word separator is either a whitespace, a slash, a tab or a non-breaking space.
 * Opening and closing square brackets are added to deal correctly with shortcodes downstream.
 * Do not add punctuation marks to this regex, as they are handled separately inside splitIntoTokens().
 * The word separator explicitly only contains characters that split two words and not a word and a space.
 * - A space is a word separator because it separates two words if it occurs between them. For example: "foo bar"
 * - A tab is a word separator because it separates two words if it occurs between them. For example: "foo	bar"
 * - A non-breaking space is a word separator because it separates two words if it occurs between them. For example: "foo\u00A0bar".
 * Note that &nbsp; is added here as #nbsp; -- we transform the & to # to prevent parse5 from converting it to a space and messing up highlighting.
 */
const wordSeparatorsRegex = /([\s\t\u00A0[\]]|#nbsp;)/;

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
 * @returns {string[]} An array of tokens.
 */
const getWordsForHTMLParser = ( text ) => {
	if ( ! text ) {
		return [];
	}

	// Split the sentence string into tokens. Those tokens are unrefined as they may contain punctuation.
	const rawTokens = text.split( wordSeparatorsRegex ).filter( x => x !== "" );

	const tokenTexts = [];
	rawTokens.forEach( token => {
		// Pretokens contains all that occurs before the first letter of the token.
		const preTokens = [];
		// Posttokens contains all that occurs after the last letter of the token.
		const postTokens = [];

		// Add all punctuation marks that occur before the first letter of the token to the pretokens array.
		// Also, prevent matching with a hashed HTML entity in the beginning of the token.
		while ( punctuationRegexStart.test( token ) && ! hashedHtmlEntitiesRegexStart.test( token ) ) {
			preTokens.push( token[ 0 ] );
			token = token.slice( 1 );
		}
		// Add all punctuation marks that occur after the last letter of the token to the posttokens array.
		// Also, prevent matching with a hashed HTML entity at the end of the token.
		while ( punctuationRegexEnd.test( token ) && ! hashedHtmlEntitiesRegexEnd.test( token ) ) {
			// Using unshift here because we are iterating from the end of the string to the beginning,
			// and we want to keep the order of the punctuation marks.
			// Therefore, we add them to the start of the array.
			postTokens.unshift( token[ token.length - 1 ] );
			token = token.slice( 0, -1 );
		}

		let currentTokens = [ ...preTokens, token, ...postTokens ];
		currentTokens = currentTokens.filter( x => x !== "" );
		tokenTexts.push( ...currentTokens );
	} );

	return tokenTexts;
};

export default getWordsForHTMLParser;
