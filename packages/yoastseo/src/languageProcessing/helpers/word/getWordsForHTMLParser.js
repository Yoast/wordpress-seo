import { punctuationRegexEnd, punctuationRegexStart } from "../sanitize/removePunctuation";

/*
 * The following regex matches a word separator. A word separator is either a whitespace, a slash, a backslash, a
 * tab or a non-breaking space.
 * The regex is used to split a text into tokens.
 * Do not add punctuation marks to this regex, as they are handled separately inside splitIntoTokens().
 * The word separator explicitly only contains characters that split two words and not a word and a space.
 * A space is a word separator because it separates two words if it occurs between two words. For example: "foo bar"
 * A slash is a word separator because it separates two words if it directly borders those words. For example: "foo/bar"
 * A backslash is a word separator because it separates two words if it occurs between two words. For example: "foo\bar"
 * A tab is a word separator because it separates two words if it occurs between two words. For example: "foo	bar"
 * A non-breaking space is a word separator because it separates two words if it occurs between two words. For example: "foo\u00A0bar"
 */
const wordSeparatorsRegex = /([\s\t\u00A0])/;

/**
 * Returns an array with tokens used in the text.
 * @param text
 * @return {*[]}
 */
const getWordsForHTMLParser = ( text ) => {
	// Split the sentence string into tokens. Those tokens are unrefined as they may contain punctuation.
	const rawTokens = text.split( wordSeparatorsRegex ).filter( x => x !== "" );

	const tokenTexts = [];
	rawTokens.forEach( token => {
		if ( token === "" ) {
			return;
		}
		// Pretokens contains all that occurs before the first letter of the token.
		const preTokens = [];
		// Posttokens contains all that occurs after the last letter of the token.
		const postTokens = [];

		// Add all punctuation marks that occur before the first letter of the token to the pretokens array.
		while ( punctuationRegexStart.test( token ) ) {
			preTokens.push( token[ 0 ] );
			token = token.slice( 1 );
		}
		// Add all punctuation marks that occur after the last letter of the token to the posttokens array.
		while ( punctuationRegexEnd.test( token ) ) {
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
