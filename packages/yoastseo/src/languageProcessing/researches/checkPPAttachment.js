import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// verb - zero or one determiner - zero or multiple adjectives - noun - preposition - zero or one determiner - zero or multiple adjectives - noun
const ppAttachmentRegExp = new RegExp( "<VB.?>(?:<DT>)?(?:<JJ>)*<NN.?><IN>(?:<DT>)?(?:<JJ>)*<NN.?>" );

/**
 * An object containing the results of the PP attachment research for a single sentence.
 *
 * The structure of the data is:
 * @example
 * {
 * sentence: "John saw people with large telescopes.",
 * reading1: "saw * with telescopes",
 * reading2: "people with telescopes",
 * construction: [ "saw", "people", "with", "large", "telescopes" ],
 * }
 *
 * @typedef {Object} 	PPAttachmentResult
 * @property {string}	sentence		The sentence.
 * @property {string}	reading1		The first reading, in which the PP attaches to the verb.
 * @property {string}	reading2		The second reading, in which the PP attaches to the noun.
 * @property {string[]}	construction	The ambiguous construction as a whole.
 */

/**
 * Handles a match: extracts the construction and the two possible readings from the sentence.
 *
 * @param {string} sentence The current sentence.
 * @param {Object[]} tags The assigned part-of-speech tags.
 * @param {RegExpMatchArray} match The match.
 * @returns {PPAttachmentResult} The result.
 */
function handleMatch( sentence, tags, match ) {
	const construction = [];
	const reading1 = [];
	const reading2 = [];

	const indexStart = match.index;
	const indexFinal = indexStart + match[ 0 ].length;
	let indexCurrent = 0;
	let afterPreposition = false;
	tags.forEach( tag => {
		const wordCurrent = tag[ 0 ];
		const tagCurrent = tag[ 1 ];
		if ( indexStart <= indexCurrent && indexCurrent < indexFinal ) {
			construction.push( wordCurrent );
			switch ( tagCurrent.slice( 0, 2 ) ) {
				case "VB":
					reading1.push( wordCurrent );
					break;
				case "DT":
					if ( afterPreposition ) {
						reading1.push( wordCurrent );
						reading2.push( wordCurrent );
					}
					break;
				case "NN":
					if ( afterPreposition ) {
						reading1.push( wordCurrent );
					}
					reading2.push( wordCurrent );
					break;
				case "IN":
					afterPreposition = true;
					reading1.push( wordCurrent );
					reading2.push( wordCurrent );
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
}

/**
 * Obtains sentence readings if it matches regex for PP attachment.
 *
 * @param {POSTagger} tagger The Parts-Of-Speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {PPAttachmentResult|null} The ambiguous construction (empty if none found), as well as the two alternative readings.
 */
function getReadings( tagger, sentence ) {
	const words = getWords( sentence, false );
	const tags = tagger.tag( words );

	// Convert the tags to a string so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );
	// Checks if there is a match
	const match = tagString.match( ppAttachmentRegExp );

	if ( match !== null ) {
		return handleMatch( sentence, tags, match );
	}

	return null;
}

/**
 * Finds all sentences with (problematic) PP attachment.
 *
 * @param {string[]} sentences The sentences in the text.
 * @param {Researcher} researcher The researcher to use for analysis.
 * @returns {Promise<PPAttachmentResult[]>} (potentially) syntactically ambiguous sentences.
 */
function findPPAttachments( sentences, researcher ) {
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
// async function findPPAttachments( sentences, researcher ) {
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
 * Finds sentences in the text that have PP attachment.
 *
 * @param {Paper} paper The Paper object to obtain the text from.
 * @param {Researcher} 	researcher 	The researcher to use for the analysis.
 * @returns {Promise<PPAttachmentResult[]>} The ambiguous constructions from the text.
 */
export default function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return findPPAttachments( sentences, researcher );
}

export const ppGoogleSearch = async function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return await findPPAttachments( sentences, researcher );
};
