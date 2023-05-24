import { cloneDeep } from "lodash-es";

const wordCouplers = [ "_", "-" ];

/**
 * Matches a keyword with a sentence object from the html parser.
 *
 * @param {(string[])[]} keywordForms The keyword forms.
 * E.g. If the keyphrase is "key word", then (if premium is activated) this will be [ [ "key", "keys" ], [ "word", "words" ] ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {Sentence} sentence The sentence to match against the keywordForms.
 *
 * @returns {Token[]} The tokens that match the keywordForms.
 *
 * The algorithm is as follows:
 *
 * It iterates over all tokens in the sentence. It compares the current token with the keyword forms.
 * If it matches, it adds the token to the matches array.
 *
 * The keyword forms are tokenized differently than the sentence.
 * The keyword forms are tokenized with researcher.getResearch( "morphology" ) and the sentence is tokenized with the html parser.
 * This leads to differences in tokenization. For example, the html parser tokenizes "key-word" as [ "key", "-", "word" ]. The morphology
 * tokenizes it as [ "key-word" ].
 * This function corrects for these differences by combining tokens that are separated by a word coupler (e.g. "-") into one token: the matchToken.
 * This matchToken is then compared with the keyword forms.
 */
const matchKeywordWithSentence = ( keywordForms, sentence ) => {
	const tokens = sentence.tokens.slice();

	// Filter out all tokens that do not match the keyphrase forms.
	const matches = [];

	// Iterate over all tokens in the sentence.
	for ( let i = 0; i < tokens.length; i++ ) {
		const matchToken = cloneDeep( tokens[ i ] );

		// An array to keep track of all tokens that are combined into the matchtoken.
		const matchTokens = [ ];
		matchTokens.push( cloneDeep( tokens[ i ] ) );

		// While the next token is a word coupler, add it to the current token.
		while ( tokens[ i + 1 ] && wordCouplers.includes( tokens[ i + 1 ].text ) ) {
			// Add the word coupler to the matchtoken.
			i++;
			matchToken.text += tokens[ i ].text;
			matchToken.sourceCodeRange.endOffset = tokens[ i ].sourceCodeRange.endOffset;
			matchTokens.push( tokens[ i ] );

			// If there is a token after the word coupler, add it to the matchtoken as well.
			i++;
			if ( ! tokens[ i ] ) {
				break;
			}
			matchToken.text = matchToken.text + tokens[ i ].text;
			matchToken.sourceCodeRange.endOffset = tokens[ i ].sourceCodeRange.endOffset;
			matchTokens.push( tokens[ i ] );
		}

		// Compare the matchtoken with the keyword forms.
		keywordForms.forEach( ( keywordForm ) => {
			keywordForm.forEach( ( keywordFormPart ) => {
				if ( matchToken.text.toLowerCase() === keywordFormPart.toLowerCase() ) {
					matches.push( ...matchTokens );
				}
			} );
		} );
	}

	return matches;
};

export default matchKeywordWithSentence;
