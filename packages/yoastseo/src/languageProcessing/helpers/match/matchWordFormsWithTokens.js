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
		const foundWord = tokens.filter( token => token === form );
		if ( foundWord.length  > 0 ) {
			result.matches.concat( foundWord );
			result.count += foundWord.length;
		}
	} );

	return result;
}
