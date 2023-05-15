import { uniq } from "lodash-es";
import Token from "../../../parse/structure/Token";
import matchTokenWithWordForms from "../keywordCount/matchTokenWithWordForms";

/**
 * Gets all indices of a word in a sentence. Is only used for languages with a matchWordCustomHelper.
 * Will probably be obsolete once the tokenizer for Japanese is implemented.
 * @param {string} word The word.
 * @param {Sentence} sentence The sentence.
 * @returns {array} The indices.
 */
const getAllIndicesOfWord = ( word, sentence ) => {
	const text = sentence.text;

	// get all the indices of the word in the sentence.
	const indices = [];
	let index = text.indexOf( word );
	while ( index > -1 ) {
		indices.push( index );
		index = text.indexOf( word, index + 1 );
	}

	return indices;
};

/**
 * Converts the matches to the format that is used in the assessment.
 * This function is for compatibility. If matches were found with the old method with a custom match helper,
 * this function converts them to the new format that is used for the position based highlighting.
 * @param {array} matches The matches.
 * @param {Sentence} sentence The sentence.
 * @param {string[][]} keyPhraseForms The keyphrase forms.
 * @param {string} locale The locale.
 * @returns {{primaryMatches: *[], secondaryMatches: *[], position: number}} The matches in the format that is used in the assessment.
 */
const convertToPositionResult = ( matches, sentence, keyPhraseForms, locale ) => {
	const matchTokens = [];
	matches.forEach( matchObject => {
		const matchWords = matchObject.matches;

		uniq( matchWords ).forEach( matchWord => {
			const indices = getAllIndicesOfWord( matchWord, sentence );
			indices.forEach( index => {
				const startOffset = sentence.sourceCodeRange.startOffset + index;
				const endOffset = sentence.sourceCodeRange.startOffset + index + matchWord.length;

				const matchToken = new Token( matchWord, { startOffset: startOffset, endOffset: endOffset } );

				matchTokens.push( matchToken );
			} );
		} );
	} );

	// Sort tokens on startOffset.
	matchTokens.sort( ( a, b ) => a.sourceCodeRange.startOffset - b.sourceCodeRange.startOffset );

	const primaryMatches = [];
	const secondaryMatches = [];

	let currentMatch = [];
	let keyPhraseFormsIndex = 0;

	// A primary match is a match that contains all the keyphrase forms in the same order as they occur in the keyphrase.
	// A secondary match is any other match.
	matchTokens.forEach( ( token ) => {
		const head = keyPhraseForms[ keyPhraseFormsIndex ];
		if ( head && matchTokenWithWordForms( head, token, locale ) ) {
			// If the token matches the head of the keyphrase form.
			currentMatch.push( token );
			keyPhraseFormsIndex += 1;
			if ( currentMatch.length === keyPhraseForms.length ) {
				primaryMatches.push( currentMatch );
				currentMatch = [];
				keyPhraseFormsIndex = 0;
			}
		} else {
			// If the token does not match the head of the keyphrase form.
			if ( currentMatch.length > 0 ) {
				// If there is a current match, add the current token to the secondary matches.
				secondaryMatches.push( currentMatch );
				currentMatch = [ token ];
				keyPhraseFormsIndex = 1;
				// keyPhraseFormsIndex = 0;
			} else {
				secondaryMatches.push( [ token ] );
				currentMatch = [  ];
				keyPhraseFormsIndex = 0;
			}
			// currentMatch = [];
			// keyPhraseFormsIndex = 0;
		}
	} );


	return {
		primaryMatches: primaryMatches,
		secondaryMatches: secondaryMatches,
		position: 0,
	};
};

export default convertToPositionResult;
