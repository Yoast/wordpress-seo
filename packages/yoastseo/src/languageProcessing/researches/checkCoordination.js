import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// adjective - noun - coordination - noun
const adjectiveRegExp = new RegExp( "<JJ><NN.?><CC><NN.?>" );
// noun - coordination - noun - noun
const compoundRegExp = new RegExp( "<NN.?><CC><NN.?><NN.?>" );

let construction = [];
let reading1 = [];
let reading2 = [];
/**
 * Checks whether a sentence has ambiguous Coordination.
 *
 * @param {POSTagger} tagger The part-of-speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {boolean} Whether the current sentence is regarded ambiguous.
 */
function handleMatchAdjective( sentence, tags, match ) {
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
function handleMatchCompound( sentence, tags, match ) {
	construction = [];
	reading1 = [];
	reading2 = [];
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
		// Add 2 because we added brackets to the tagString later.
		indexCurrent += tag[ 1 ].length + 2;
	} );

	return {
		sentence: sentence,
		construction: construction,
		reading1: reading1.join( " " ),
		reading2: reading2.join( " " ),
	};
}
/**
 * Obtains sentence readings if it matches regex for (potentially) ambiguous coordination.
 *
 * @param {POSTagger} tagger The Parts-Of-Speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {CoordinationResult|null} The ambiguous construction (empty if none found), as well as the two alternative readings.
 */
function getReadings( tagger, sentence ) {
	const words = getWords( sentence, false );
	const tags = tagger.tag( words );

	// Convert the tags to a string so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );
	// Checks if there is a match
	let match = tagString.match( adjectiveRegExp );

	if ( match !== null ) {
		return handleMatchAdjective( sentence, tags, match );
	}

	match = tagString.match( compoundRegExp );

	if ( match !== null ) {
		return handleMatchCompound( sentence, tags, match );
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
		const result = getReadings( tagger, sentence );
		if ( result !== null ) {
			ambiguousSentences.push( result );
		}
	} );

	return ambiguousSentences;
}

/**
 * Finds sentences in the text that (potentially) have Coordination Ambiguity.
 *
 * @param {Paper} paper The Paper object to obtain the text from.
 * @param {Researcher} The The researcher to use for the analysis.
 * @returns {CoordinationResult[]} The ambiguous constructions from the text.
 */
export default function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return findCoordination( sentences, researcher );
}

export const coordinationGoogleSearch = async function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return await findCoordination( sentences, researcher );
};
