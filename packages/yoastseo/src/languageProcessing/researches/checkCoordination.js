import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// adjective - noun - coordination - noun
const adjectiveRegExp = new RegExp( "<JJ><NN.?><CC><NN.?>" );
// noun - coordination - noun - noun
const compoundRegExp = new RegExp( "<NN.?><CC><NN.?><NN.?>" );

/**
 * Checks whether a sentence has ambiguous PP attachment.
 *
 * @param {POSTagger} tagger The part-of-speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {boolean} Whether the current sentence is regarded ambiguous.
 */
function isAmbiguous( tagger, sentence ) {
	const words = getWords( sentence );
	const tags = tagger.tag( words );

	// Convert the tags to a string, so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );

	// Try to match both the adjectiveRegExp and the compoundRegExp
	let match = tagString.match( adjectiveRegExp );
	if ( match === null ) {
		match = tagString.match( compoundRegExp );
	}

	return match !== null;
}

/**
 * Finds all sentences with (problematic) coordination.
 *
 * @param {string[]} sentences The sentences in the text.
 * @param {Researcher} researcher The researcher to use for analysis.
 * @returns {string[]} (potentially) syntactically ambiguous sentences.
 */
function findCoordination( sentences, researcher ) {
	const ambiguousSentences = [];

	const tagger = researcher.getHelper( "getTagger" )();

	sentences.forEach( sentence => {
		if ( isAmbiguous( tagger, sentence ) ) {
			ambiguousSentences.push( sentence );
		}
	} );

	return ambiguousSentences;
}

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 * @returns {string[]} The ambiguous sentences from the text.
 */
export default function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return findCoordination( sentences, researcher );
}
