import getWordsForHTMLParser from "../word/getWordsForHTMLParser";

/**
 * Tokenize keyword forms for exact matching. This function gets the keyword form and tokenizes it.
 * This function assumes that if a keyphrase needs to be matched exactly, there will be only one keyword form.
 * This is the result of how the focus keyword is processed in buildTopicStems.js in the buildStems function.
 * @param {(string[])[]} keywordForms The keyword forms to tokenize.
 * @returns {string[]} The tokenized keyword forms.
 */
const tokenizeKeywordFormsForExactMatching = ( keywordForms ) => {
	// Tokenize keyword forms.
	const keywordFormsText = keywordForms[ 0 ][ 0 ];
	return getWordsForHTMLParser( keywordFormsText );
};

/**
 * Exact matching of keyword forms in a sentence. Exact matching happens when the user puts the keyword in double quotes.
 * @param {(string[])[]} keywordForms The keyword forms to match.
 * @param {Sentence} sentence The sentence to match the keyword forms with.
 * @returns {Token[]} The tokens that exactly match the keyword forms.
 */
const exactMatching = ( keywordForms, sentence ) => {
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
 * Free matching of keyword forms in a sentence. Free matching happens when the user does not put the keyword in double quotes.
 * @param {(string[])[]} keywordForms The keyword forms to match.
 * @param {Sentence} sentence The sentence to match the keyword forms with.
 * @returns {Token[]} The tokens that match the keyword forms.
 */
const freeMatching = ( keywordForms, sentence ) => {
	const tokens = sentence.tokens.slice();

	// Filter out all tokens that do not match the keyphrase forms.
	// const matches = [];

	return tokens.filter( ( token ) => {
		return keywordForms.some( ( keywordForm ) => {
			return keywordForm.some( ( keywordFormPart ) => {
				return token.text.toLowerCase() === keywordFormPart.toLowerCase();
			} );
		} );
	} );
};

/**
 * Matches a keyword with a sentence object from the html parser.
 *
 * @param {(string[])[]} keywordForms The keyword forms.
 * E.g. If the keyphrase is "key word", then (if premium is activated) this will be [ [ "key", "keys" ], [ "word", "words" ] ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {Sentence} sentence The sentence to match against the keywordForms.
 * @param {boolean} useExactMatching Whether to match the keyword forms exactly or not.
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
const matchKeyphraseWithSentence = ( keywordForms, sentence, useExactMatching = false ) => {
	if ( useExactMatching ) {
		return exactMatching( keywordForms, sentence );
	}
	return freeMatching( keywordForms, sentence );
};

export default matchKeyphraseWithSentence;
