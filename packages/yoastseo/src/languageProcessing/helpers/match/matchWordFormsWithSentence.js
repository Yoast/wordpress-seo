import matchTextWithTransliteration from "./matchTextWithTransliteration";
import splitIntoTokens from "../word/splitIntoTokens";

/**
 * Tokenizes the word form of the keyphrase for exact matching. This function gets the word form and tokenizes it.
 * This function assumes that if a keyphrase needs to be matched exactly, there will be only one word form.
 * This is the result of how the focus keyphrase is processed in buildTopicStems.js in the buildStems function.
 *
 * @param {(string[])}  wordForms 					The word forms to tokenize.
 * @param {function}	customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {string[]} The tokenized word forms.
 */
export const tokenizeKeyphraseFormsForExactMatching = ( wordForms, customSplitIntoTokensHelper ) => {
	// Tokenize word form of the keyphrase.
	const wordFormText = wordForms[ 0 ];

	return customSplitIntoTokensHelper ? customSplitIntoTokensHelper( wordFormText ) : splitIntoTokens( wordFormText );
};

/**
 * Gets the exact matches of the keyphrase.
 * Exact matching happens when the user puts the keyphrase in double quotes.
 *
 * @param {Sentence}	sentence					The sentence to match the word forms with.
 * @param {string[]}	wordForms					The word forms to match.
 * @param {string}		locale						The locale used in the analysis.
 * @param {function}	customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {{count: number, matches: Token[]}} Object containing the number of the exact matches and the matched tokens.
 */
const findExactMatchKeyphraseInSentence = ( sentence, wordForms, locale, customSplitIntoTokensHelper ) => {
	const result = {
		count: 0,
		matches: [],
	};
	// Tokenize word forms of the keyphrase.
	const keyphraseTokens = tokenizeKeyphraseFormsForExactMatching( wordForms, customSplitIntoTokensHelper );

	const sentenceTokens = sentence.tokens;

	// Initialize the index of the word token of the keyphrase.
	let indexOfWordInKeyphrase = 0;
	// Initialize the index of the word token of the sentence.
	let indexOfWordInSentence = 0;
	let currentMatch = [];

	// Check if the tokenized word forms occur in the same order in the sentence tokens.
	while ( indexOfWordInSentence < sentenceTokens.length ) {
		// If the current sentence token matches the current word token of the keyphrase, add it to the current match.
		const sentenceTokenText = sentenceTokens[ indexOfWordInSentence ].text;
		const keyphraseTokenText = keyphraseTokens[ indexOfWordInKeyphrase ];

		const foundMatches = matchTextWithTransliteration( sentenceTokenText.toLowerCase(), keyphraseTokenText.toLowerCase(), locale );

		if ( foundMatches.length > 0 ) {
			currentMatch.push( sentenceTokens[ indexOfWordInSentence ] );
			indexOfWordInKeyphrase++;
		} else {
			indexOfWordInKeyphrase = 0;
			currentMatch = [];
		}

		/*
		 * If the current match has the same length as the keyphrase tokens, the keyphrase forms have been matched.
		 * Add the current match to the matches array and reset the index of the word in keyphrase and the current match.
		 */
		if ( currentMatch.length === keyphraseTokens.length ) {
			result.matches.push( ...currentMatch );
			result.count++;
			indexOfWordInKeyphrase = 0;
			currentMatch = [];
		}

		indexOfWordInSentence++;
	}
	return result;
};

/**
 * Matches a word form of the keyphrase with the tokens from the sentence.
 *
 * With this approach, we transliterate the word form of the keyphrase before matching it with the sentence tokens.
 * However, we don't do the transliteration step for the sentence tokens.
 * As a result, for example, the word form "acción" from the keyphrase will match the word "accion" in the sentence.
 * But, the word form "accion" from the keyphrase will NOT match the word "acción" in the sentence.
 *
 * @param {Token[]}	tokens		The array of tokens to check.
 * @param {string}	wordForm	The word form of the keyphrase.
 * @param {string}	locale		The locale used in the analysis.
 *
 * @returns {Token[]}	The array of the matched tokens.
 */
const matchWordFormInTokens = ( tokens, wordForm, locale ) => {
	let matches = [];

	tokens.forEach( token => {
		const occurrence = matchTextWithTransliteration( token.text, wordForm, locale );
		if ( occurrence.length > 0 ) {
			matches = matches.concat( token );
		}
	} );

	return matches;
};

/**
 * Finds keyphrase forms in a sentence.
 *
 * @param {Sentence|string}	sentence				The sentence to check.
 * @param {string[]}		wordForms				The word forms of the keyphrase to check.
 * @param {string}			locale					The locale used in the analysis.
 * @param {function}		matchWordCustomHelper	Custom function to match a word form with sentence.
 *
 * @returns {{count: number, matches: (Token|string)[]}} Object containing the number of the matches and the matched tokens.
 */
const matchWordFormsInSentence = ( sentence, wordForms, locale, matchWordCustomHelper ) => {
	const result = {
		count: 0,
		matches: [],
	};

	wordForms.forEach( wordForm => {
		let occurrences = [];
		if ( matchWordCustomHelper ) {
			occurrences = matchWordCustomHelper( sentence, wordForm );
		} else {
			const tokens = sentence.tokens.slice();
			occurrences = matchWordFormInTokens( tokens, wordForm, locale );
		}
		result.count += occurrences.length;
		result.matches = result.matches.concat( occurrences );
	} );

	return result;
};

/**
 * Matches the word forms of a keyphrase with a sentence object from the html parser.
 *
 * @param {Sentence|string}	sentence					The sentence to match against the word forms of a keyphrase.
 * @param {string[]}		wordForms					The array of word forms of the keyphrase.
 * E.g. If the keyphrase is "key word", then (if Premium is activated) this will be [ "key", "keys" ] OR [ "word", "words" ]
 * The forms are retrieved higher up (among others in keywordCount.js) with researcher.getResearch( "morphology" ).
 * @param {string}			locale						The locale used for transliteration.
 * @param {function}		matchWordCustomHelper		Custom function to match a word form with sentence.
 * @param {boolean}			useExactMatching			Whether to match the keyphrase forms exactly or not.
 * 														Exact match is used when the keyphrase is enclosed in double quotes.
 * @param {function}		customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {{count: number, matches: (Token|string)[]}} Object containing the number of the matches and the matched tokens.
 */
const matchWordFormsWithSentence = ( sentence, wordForms, locale, matchWordCustomHelper, useExactMatching = false, customSplitIntoTokensHelper ) => {
	/*
	 * Only use `findExactMatchKeyphraseInSentence` when the custom helper is not available.
	 * When the custom helper is available, the step for the exact matching happens in the helper.
	 */
	if ( useExactMatching && ! matchWordCustomHelper ) {
		return findExactMatchKeyphraseInSentence( sentence, wordForms, locale, customSplitIntoTokensHelper );
	}
	return matchWordFormsInSentence( sentence, wordForms, locale, matchWordCustomHelper );
};

export default matchWordFormsWithSentence;
