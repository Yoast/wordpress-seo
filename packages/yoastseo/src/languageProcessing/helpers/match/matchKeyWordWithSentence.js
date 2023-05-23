import { cloneDeep } from "lodash-es";

const wordCouplers = [ "_", "-" ];

/**
 * Matches a keyword with a sentence object from the html parser.
 *
 * @param {(string[])[]} keywordForms The keyword forms.
 * E.g. If the keyphrase is "key word", then (if premium is activated) this will be [ [ "key", "keys" ], [ "word", "words" ] ]
 * The forms are retrieved higher up (a.o. in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {Sentence} sentence The sentence to match against the keywordForms.
 *
 * @returns {Token[]} The tokens that match the keywordForms.
 *
 * The algorithm is as follows:
 *
 * It iterates over all tokens in the sentence. It compares the current token with the keyword forms.
 * If it matches, it adds the token to the matches array.
 *
 * The keyword forms are tokenized differenty than the sentence.
 * The keyword forms are tokenized with researcher.getResearch( "morphology" ) and the sentence is tokenized with the html parser.
 * This leads to differences in tokenization. For example, the html parser tokenizes "key-word" as [ "key", "-", "word" ]. The morphology
 * tokenizes it as [ "key-word" ].
 * This function corrects for these differences by combining tokens that are separated by a word coupler (e.g. "-") into one token: the matchToken.
 * This matchToken is then compared with the keyword forms.
 * If the wordcoupler is a "-", it also individually matches the tokens that are separated by the "-" with the keyword forms.
 */
const matchKeywordWithSentence = ( keywordForms, sentence ) => {
	const tokens = sentence.tokens.slice();

	// filter out all tokens that do not match the keyword forms
	const matches = [];

	// Iterate over all tokens in the sentence.
	for ( let i = 0; i < tokens.length; i++ ) {
		const matchToken = cloneDeep( tokens[ i ] );
		// const matchToken2 = Object.assign( {}, tokens[ i ] );
		const matchTokens = [ ];

		// An array of tokens that need to be matched.
		// const tokensToMatch = [];

		// matchTokens.push( matchToken2 );
		matchTokens.push( cloneDeep( tokens[ i ] ) );

		// while the next token is a word coupler, add it to the current token as well as the next token.
		while ( tokens[ i + 1 ] && wordCouplers.includes( tokens[ i + 1 ].text ) ) {
			// if ( tokens[ i + 1 ].text === "-" && tokens[ i + 2 ] ) {
			// 	tokensToMatch.push( tokens[ i ] );
			// }

			i++;

			matchToken.text += tokens[ i ].text;
			matchToken.sourceCodeRange.endOffset = tokens[ i ].sourceCodeRange.endOffset;
			matchTokens.push( tokens[ i ] );
			i++;
			if ( ! tokens[ i ] ) {
				break;
			}
			matchToken.text = matchToken.text + tokens[ i ].text;
			matchToken.sourceCodeRange.endOffset = tokens[ i ].sourceCodeRange.endOffset;
			matchTokens.push( tokens[ i ] );

			// if ( tokens[ i - 1 ].text === "-" ) {
			// 	tokensToMatch.push( tokens[ i ] );
			// }
		}
		// tokensToMatch.push( matchToken );
		// let exitAllLoops = false;
		// console.log( tokensToMatch );
		keywordForms.forEach( ( keywordForm ) => {
			// if ( exitAllLoops ) {
			// 	return;
			// }
			keywordForm.forEach( ( keywordFormPart ) => {
				if ( matchToken.text.toLowerCase() === keywordFormPart.toLowerCase() ) {
					matches.push( ...matchTokens );
					// exitAllLoops = true;
					// return is implicit
				}
			} );
		} );
	}

	return matches;
};

export default matchKeywordWithSentence;
