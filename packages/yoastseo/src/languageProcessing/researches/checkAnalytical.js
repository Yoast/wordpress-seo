import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// adjective - noun - noun
const analyticalRegExp = new RegExp( "<JJ><NN.?><NN.?>" );

/**
 * Checks whether a sentence has Analytical Ambiguity.
 *
 * @param {POSTagger} tagger The part-of-speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {Object|null} The words composing the ambiguous construction (empty if none found), as well as the two alternative readings.
 */

function isAmbiguous( tagger, sentence ) {
	const words = getWords( sentence, false );
	const tags = tagger.tag( words );

	// Convert the tags to a string, so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );
	// Try to match the the analyticalRegExp
	const match = tagString.match( analyticalRegExp );
	const construction = [];
	const reading1 = [];
	const reading2 = [];
	const wordFix = [];
	if ( match !== null ) {
		const indexStart = match.index;
		const indexFinal = indexStart + match[ 0 ].length;
		let indexCurrent = 0;
		tags.forEach( tag => {
			if ( indexStart <= indexCurrent && indexCurrent < indexFinal ) {
				const wordCurrent = tag[ 0 ];
				const tagCurrent = tag[ 1 ];
				construction.push( wordCurrent );
				switch ( tagCurrent.slice( 0, 2 ) ) {
					case "JJ":
						reading1.push( wordCurrent );
						reading2.push( wordCurrent );
						break;
					case "NN":
						if ( reading1.length === 1 ) {
							wordFix.push( wordCurrent );
							reading1.push( wordCurrent );
						}
						else {
							reading1.unshift( wordCurrent, "of" );
							reading2.push( wordCurrent, "of", wordFix );
						}
						break;
					default:
						break;
				}
			}
			// Add 2 because we added brackets to the tagString above.
			indexCurrent += tag[ 1 ].length + 2;
		} );


		return {
			sentence: sentence,
			construction: construction,
			reading1: reading1.join( " " ),
			reading2: reading2.join( " " ),
		};
	}
	return null;
}
/**
 * Finds all sentences with (problematic) analytical constructions.
 *
 * @param {string[]} sentences The sentences in the text.
 * @param {Researcher} researcher The researcher to use for analysis.
 * @returns {string[]} (potentially) syntactically ambiguous sentences.
 */
function findAnalytical( sentences, researcher ) {
	const ambiguousSentences = [];

	const tagger = researcher.getHelper( "getTagger" )();

	sentences.forEach( sentence => {
		const result = isAmbiguous( tagger, sentence );
		if ( result !== null ) {
			ambiguousSentences.push( result );
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

	return findAnalytical( sentences, researcher );
}
