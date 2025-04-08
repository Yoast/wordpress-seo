import stripSpaces from "../helpers/sanitize/stripSpaces";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { getWordsFromTokens } from "../helpers/word/getAllWordsFromTree";
import { elementHasClass, elementHasName } from "../../parse/build/private/filterHelpers";
import filterTree from "../../parse/build/private/filterTree";
import { cloneDeep } from "lodash";

/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../parse/structure/").Node} Node
 * @typedef {import("../../parse/structure/Sentence").default} Sentence
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * @typedef {Object} SentenceBeginning
 * @property {string} word The first word of the sentence.
 * @property {number} count The number of sentences that start with this word.
 * @property {Sentence[]} sentences The sentences that start with this word.
 */

/**
 * Counts the number of similar sentence beginnings.
 *
 * @param {string[]} sentenceBeginnings The array containing the first word of each sentence.
 * @param {Sentence[]} sentences The array containing all sentences.
 * @returns {SentenceBeginning[]} The array containing the objects containing the first words and the corresponding counts.
 */
const compareFirstWords = ( sentenceBeginnings, sentences ) => {
	const consecutiveFirstWords = [];
	let currentSentences = [];

	sentenceBeginnings.forEach( ( currentBeginning, i ) => {
		const nextBeginning = sentenceBeginnings[ i + 1 ];
		currentSentences.push( sentences[ i ] );

		if ( currentBeginning && currentBeginning !== nextBeginning ) {
			consecutiveFirstWords.push( { word: currentBeginning, count: currentSentences.length, sentences: currentSentences } );
			currentSentences = [];
		}
	} );

	return consecutiveFirstWords;
};

/**
 * Retrieves the first word from the sentence. If the first or second word is on an exception list of words that should not be considered as sentence
 * beginnings, the following word is also retrieved.
 *
 * @param {Sentence} sentence The sentence to retrieve the first word from.
 * @param {string[]} firstWordExceptions First word exceptions to match against.
 * @param {string[]} secondWordExceptions Second word exceptions to match against.
 *
 * @returns {string} The first word of the sentence.
 */
const getSentenceBeginning = ( sentence, firstWordExceptions, secondWordExceptions ) => {
	const words = getWordsFromTokens( sentence.tokens, false )
		.filter( word => stripSpaces( word ) !== " " );

	if ( words.length === 0 ) {
		return "";
	}

	let sentenceBeginning = words[ 0 ].toLowerCase();

	if ( firstWordExceptions.includes( sentenceBeginning ) && words.length > 1 ) {
		sentenceBeginning += " " + words[ 1 ].toLowerCase();
		if ( secondWordExceptions && secondWordExceptions.includes( words[ 1 ] ) ) {
			sentenceBeginning += " " + words[ 2 ].toLowerCase();
		}
	}

	return sentenceBeginning;
};

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher this research is a part of.
 *
 * @returns {SentenceBeginning[]} The object containing the first word of each sentence and the corresponding counts.
 */
export default ( paper, researcher ) => {
	const firstWordExceptions = researcher.getConfig( "firstWordExceptions" );
	const secondWordExceptions = researcher.getConfig( "secondWordExceptions" );

	// Filter out lists and tables from the tree.
	const additionalFilters = [
		elementHasName( "ol" ),
		elementHasName( "ul" ),
		elementHasName( "table" ),
		elementHasClass( "wp-block-table" ),
	];

	// Clone the tree, as filterTree will modify the tree.
	let tree = cloneDeep( paper.getTree() );
	tree = filterTree( tree, additionalFilters );

	// Get all sentences from the tree, and find their sentence beginnings.
	const sentences = getSentencesFromTree( tree );
	const sentenceBeginnings = sentences.map( sentence => getSentenceBeginning( sentence, firstWordExceptions, secondWordExceptions ) );

	// Turn the sentence beginnings into an array that combines sentences beginning with the same word(s).
	return compareFirstWords( sentenceBeginnings, sentences );
};
