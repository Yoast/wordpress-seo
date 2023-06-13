import { cloneDeep } from "lodash-es";
import getWordsForHTMLParser from "../word/getWordsForHTMLParser";

const wordCouplers = [ "_", "-", "'" ];

const tokenizeKeywordFormsForExactMatching = ( keywordForms ) => {
	// Tokenize keyword forms.
	const keywordFormsText = keywordForms[ 0 ][ 0 ];
	console.log( keywordFormsText );
	return getWordsForHTMLParser( keywordFormsText );
};

const exactMatch = ( keywordForms, sentence ) => {
	// Tokenize keyword forms.
	const keywordTokens = tokenizeKeywordFormsForExactMatching( keywordForms );

	const sentenceTokens = sentence.tokens;

	// Check if tokenized keyword forms occur in the same order in the sentence tokens.
	let keywordIndex = 0;
	let sentenceIndex = 0;
	const matches = [];
	let currentMatch = [];

	while ( sentenceIndex < sentenceTokens.length ) {
		// If the current sentence token matches the current keyword token, add it to the current match.
		const sentenceTokenText = sentenceTokens[ sentenceIndex ].text;
		const keywordTokenText = keywordTokens[ keywordIndex ];

		if ( sentenceTokenText.toLowerCase() === keywordTokenText.toLowerCase() ) {
			currentMatch.push( sentenceTokens[ sentenceIndex ] );
			keywordIndex++;
		} else {
			keywordIndex = 0;
			currentMatch = [];
		}

		// If the current match has the same length as the keyword tokens, the keyword forms have been matched.
		// Add the current match to the matches array and reset the keyword index and the current match.
		if ( currentMatch.length === keywordTokens.length ) {
			matches.push( ...currentMatch );
			keywordIndex = 0;
			currentMatch = [];
		}

		sentenceIndex++;
	}
	return matches;
};

/**
 * Matches a keyword with a sentence object from the html parser.
 *
 * @param {(string[])[]} keywordForms The keyword forms.
 * E.g. If the keyphrase is "key word", then (if premium is activated) this will be [ [ "key", "keys" ], [ "word", "words" ] ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {Sentence} sentence The sentence to match against the keywordForms.
 * @param {boolean} exactMatching Whether to match the keyword forms exactly or not.
 * Depends on whether the user has put the keyphrase in double quotes.
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
const matchKeyphraseWithSentence = ( keywordForms, sentence, exactMatching = false ) => {
	const tokens = sentence.tokens.slice();

	if ( exactMatching ) {
		return exactMatch( keywordForms, sentence );
	}

	// Filter out all tokens that do not match the keyphrase forms.
	const matches = [];

	// Iterate over all tokens in the sentence.
	for ( let i = 0; i < tokens.length; i++ ) {
		const tokenForMatching = cloneDeep( tokens[ i ] );

		// The token used for matching (tokenForMatching) may consist of multiple tokens combined,
		// since we want to combine words separated by a hyphen/underscore into one token.
		// This array keeps track of all tokens that are combined into the token used for matching
		// and is later used to add all individual tokens to the array of matches.
		const tokensForMatching = [ ];
		// Add the current token to the tokens for matching.
		tokensForMatching.push( cloneDeep( tokens[ i ] ) );

		// While the next token is a word coupler, add it to the current token.
		while ( tokens[ i + 1 ] && wordCouplers.includes( tokens[ i + 1 ].text ) ) {
			// Add the word coupler to the token for matching.
			i++;
			tokenForMatching.text += tokens[ i ].text;
			tokenForMatching.sourceCodeRange.endOffset = tokens[ i ].sourceCodeRange.endOffset;
			tokensForMatching.push( tokens[ i ] );

			// If there is a token after the word coupler, add it to the token for matching. as well.
			i++;
			if ( ! tokens[ i ] ) {
				break;
			}
			tokenForMatching.text += tokens[ i ].text;
			tokenForMatching.sourceCodeRange.endOffset = tokens[ i ].sourceCodeRange.endOffset;
			tokensForMatching.push( tokens[ i ] );
		}

		// Compare the matchtoken with the keyword forms.
		keywordForms.forEach( ( keywordForm ) => {
			keywordForm.forEach( ( keywordFormPart ) => {
				if ( tokenForMatching.text.toLowerCase() === keywordFormPart.toLowerCase() ) {
					matches.push( ...tokensForMatching );
				}
			} );
		} );
	}

	return matches;
};

export default matchKeyphraseWithSentence;
