import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// verb - zero or one determiner - zero or multiple adjectives - noun - preposition - zero or one determiner - zero or multiple adjectives - noun
const ppAttachmentRegExp = new RegExp( "<VB.?>(?:<DT>)?(?:<JJ>)*<NN.?><IN>(?:<DT>)?(?:<JJ>)*<NN.?>" );

/**
 * Checks whether a sentence has ambiguous PP attachment.
 *
 * @param {POSTagger} tagger The part-of-speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {string[]} The words composing the ambiguous construction (empty if none found).
 */
function isAmbiguous( tagger, sentence ) {
	const words = getWords( sentence, false );
	const tags = tagger.tag( words );

	// Convert the tags to a string, so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );
	const match = tagString.match( ppAttachmentRegExp );

	const result = [];
	if ( match !== null ) {
		const indexStart = match.index;
		const indexFinal = indexStart + match[0].length;
		let indexCurrent = 0;
		tags.forEach( tag => {
			if ( indexStart <= indexCurrent && indexCurrent < indexFinal ) {
				result.push( tag[ 0 ] );
			}
			// Add 2 because we added brackets to the tagString above.
			indexCurrent += tag[ 1 ].length + 2;
		} );
	}

	return result;
}

/**
 * Finds all sentences with (problematic) PP attachment.
 *
 * @param {string[]} sentences The sentences in the text.
 * @param {Researcher} researcher The researcher to use for analysis.
 * @returns {Object[]} (potentially) syntactically ambiguous sentences.
 */
function findPPAttachment( sentences, researcher ) {
	const ambiguousSentences = [];

	const tagger = researcher.getHelper( "getTagger" )();

	sentences.forEach( sentence => {
		const construction = isAmbiguous( tagger, sentence );
		if ( construction.length > 0 ) {
			console.log({ sentence: sentence, construction: construction });
			ambiguousSentences.push( { sentence: sentence, construction: construction } );
		}
	} );

	return ambiguousSentences;
}

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 * @returns {Object[]} The ambiguous constructions from the text.
 */
export default function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return findPPAttachment( sentences, researcher );
}
