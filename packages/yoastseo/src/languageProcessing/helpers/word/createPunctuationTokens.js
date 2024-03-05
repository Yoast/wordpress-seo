import { punctuationRegexEnd, punctuationRegexStart } from "../sanitize/removePunctuation";
import { hashedHtmlEntitiesRegexEnd, hashedHtmlEntitiesRegexStart } from "../../../helpers/htmlEntities";

/**
 * Removes punctuation from the beginning and end of a word token, and creates separate tokens from them.
 *
 * @param {string[]} rawTokens	The tokens that may contain punctuation at the beginning and end of words.
 *
 * @returns {string[]} The tokens with the punctuation moved into separate tokens.
 */
const createPunctuationTokens = ( rawTokens ) => {
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

export default createPunctuationTokens;
