import { uniq as unique } from "lodash-es";

/**
 * Matches an array of words with an array of tokens.
 *
 * @param {array} wordForms    The array of words to check.
 * @param {array} tokens       The array of tokens to check.
 * @returns {{count: number, matches: *[]}} The matched words.
 */
export default function matchWordFormsWithTokens( wordForms, tokens ) {
	const result = {
		count: 0,
		matches: [],
	};

	unique( wordForms ).forEach( function( form ) {
		const foundWords = tokens.filter( token => token.text === form );
		if ( foundWords.length  > 0 ) {
			result.matches = result.matches.concat( foundWords );
			result.count += foundWords.length;
		}
	} );

	return result;
}
