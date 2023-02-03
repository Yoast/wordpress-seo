import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// adjective - noun - noun
const analyticalRegExp = new RegExp( "<JJ><NN.?><NN.?>" );

/**
 * An object containing the results of the Analytical Ambiguity research for a single sentence.
 *
 * The structure of the data is:
 * @example
 * {
 * sentence: "John is an English grammar teacher.",
 * reading1: "teacher of English grammar",
 * reading2: "English teacher of grammar",
 * construction: [ "English", "grammar", "teacher" ],
 * }
 *
 * @typedef {Object} 	analyticalResult
 * @property {string}	sentence		The sentence.
 * @property {string}	reading1		The first reading, in which tche adjective attaches to the first noun.
 * @property {string}	reading2		The second reading, in which the adjective attaches to the second noun.
 * @property {string[]}	construction	The ambiguous construction as a whole.
 */

/**
 * Handles a match: extracts the construction and the two possible readings from the sentence.
 *
 * @param {string} sentence The current sentence.
 * @param {Object[]} tags The assigned part-of-speech tags.
 * @param {RegExpMatchArray} match The match.
 * @returns {AnalyticalResult} The result.
 */
function handleMatch( sentence, tags, match ) {
	const construction = [];
	const reading1 = [];
	const reading2 = [];
	let firstNoun = "";
	const indexStart = match.index;
	const indexFinal = indexStart + match[ 0 ].length;
	let indexCurrent = 0;
	tags.forEach( tag => {
		const wordCurrent = tag[ 0 ];
		const tagCurrent = tag[ 1 ];
		if ( indexStart <= indexCurrent && indexCurrent < indexFinal ) {
			construction.push( wordCurrent );
			switch ( tagCurrent.slice( 0, 2 ) ) {
				case "JJ":
					reading1.push( wordCurrent );
					reading2.push( wordCurrent );
					break;
				case "NN":
					if ( reading1.length === 1 ) {
						firstNoun = wordCurrent;
						reading1.push( wordCurrent );
					} else {
						reading1.unshift( wordCurrent, "of" );
						reading2.push( wordCurrent, "of", firstNoun );
					}
					break;
				default:
					break;
			}
		}
		// Add 2 because we added brackets to the tagString earlier.
		indexCurrent += tagCurrent.length + 2;
	} );


	return {
		sentence: sentence,
		construction: construction,
		reading1: reading1.join( " " ),
		reading2: reading2.join( " " ),
	};
	return null;
}

/**
 * Obtains sentence readings if it matches regex for Analytical constructions.
 *
 * @param {POSTagger} tagger The Parts-Of-Speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {AnalyticalResult|null} The ambiguous construction (empty if none found), as well as the two alternative readings.
 */
function getReadings( tagger, sentence ) {
	const words = getWords( sentence, false );
	const tags = tagger.tag( words );

	// Convert the tags to a string so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );
	// Checks if there is a match
	const match = tagString.match( analyticalRegExp );

	if ( match !== null ) {
		return handleMatch( sentence, tags, match );
	}

	return null;
}
/**
 * Finds all sentences with (problematic) Analytical constructions.
 *
 * @param {string[]} sentences The sentences in the text.
 * @param {Researcher} researcher The researcher to use for analysis.
 * @returns {Promise<PPAttachmentResult[]>} (potentially) syntactically ambiguous sentences.
 */
function findAnalytical( sentences, researcher ) {
	const ambiguousSentences = [];

	const tagger = researcher.getHelper( "getTagger" )();

	sentences.forEach( sentence => {
		const result = getReadings( tagger, sentence );
		if ( result !== null ) {
			// result.hitsReading1 = getHits( result.reading1 );
			// result.hitsReading2 = getHits( result.reading2 );

			ambiguousSentences.push( result );
		}
	} );

	return ambiguousSentences;
}

// async function findAnalytical( sentences, researcher ) {
// 	const ambiguousSentences = [];
//
// 	const tagger = researcher.getHelper( "getTagger" )();
//
// 	await Promise.all( sentences.map( async( sentence ) => {
// 		const result = getReadings( tagger, sentence );
// 		if ( result !== null ) {
// 			// result.hitsReading1 = getHits( result.reading1 );
// 			// result.hitsReading2 = getHits( result.reading2 );
//
// 			ambiguousSentences.push( result );
// 		}
// 	} ) );
//
// 	return ambiguousSentences;
// }
/**
 * Finds sentences in the text that (potentially) have Analytical Ambiguity.
 *
 * @param {Paper} paper The Paper object to obtain the text from.
 * @param {Researcher} 	researcher 	The researcher to use for the analysis.
 * @returns {Promise<AnalyticalResult[]>} The ambiguous constructions from the text.
 */
export default function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return findAnalytical( sentences, researcher );
}

export const analyticalGoogleSearch = async function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return await findAnalytical( sentences, researcher );
};
