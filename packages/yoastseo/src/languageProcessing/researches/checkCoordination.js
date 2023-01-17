import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// adjective - noun - coordination - noun
const adjectiveRegExp = new RegExp( "<JJ><NN.?><CC><NN.?>" );
// noun - coordination - noun - noun
const compoundRegExp = new RegExp( "<NN.?><CC><NN.?><NN.?>" );

/**
 * Checks whether a sentence has ambiguous Coordination attachment.
 *
 * @param {POSTagger} tagger The part-of-speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {boolean} Whether the current sentence is regarded ambiguous.
 */
function isAmbiguous( tagger, sentence ) {
	const words = getWords( sentence, false );
	const tags = tagger.tag( words );

	// Convert the tags to a string, so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );
	// Try to match the adjectiveRegExp and the compoundRegExp
	let match = tagString.match( adjectiveRegExp );
	let construction = [];
	let reading1 = [];
	let reading2 = [];
	if ( match !== null ) {
		const indexStart = match.index;
		const indexFinal = indexStart + match[ 0 ].length;
		let indexCurrent = 0;
		let afterCoordination = false;
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
						if ( afterCoordination ) {
							reading2.push( wordCurrent );
						} else {
							reading1.push( wordCurrent );
						}
						break;
					case "CC":
						afterCoordination = true;
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
	// Try to match the the compoundRegExp
	match = tagString.match( compoundRegExp );
	construction = [];
	reading1 = [];
	reading2 = [];
	if ( match !== null ) {
		const indexStart = match.index;
		const indexFinal = indexStart + match[ 0 ].length;
		let indexCurrent = 0;
		let afterCoordination = false;
		tags.forEach( tag => {
			if ( indexStart <= indexCurrent && indexCurrent < indexFinal ) {
				const wordCurrent = tag[ 0 ];
				const tagCurrent = tag[ 1 ];
				construction.push( wordCurrent );
				switch ( tagCurrent.slice( 0, 2 ) ) {
					case "NN":
						if ( ! afterCoordination ) {
							reading1.push( wordCurrent );
						} else if ( afterCoordination ) {
							reading2.push( wordCurrent );
							if ( reading2.length > 1 ) {
								reading1.push( wordCurrent );
							}
						}
						break;
					case "CC":
						afterCoordination = true;
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

	return findCoordination( sentences, researcher );
}
