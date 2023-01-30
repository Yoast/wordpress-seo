import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

// verb - zero or one determiner - zero or multiple adjectives - noun - preposition - zero or one determiner - zero or multiple adjectives - noun
const ppAttachmentRegExp = new RegExp( "<VB.?>(?:<DT>)?(?:<JJ>)*<NN.?><IN>(?:<DT>)?(?:<JJ>)*<NN.?>" );

/**
 * Obtains sentence readings if it matches regex for PP attachment.
 *
 * @param {POSTagger} tagger The Parts-Of-Speech tagger.
 * @param {string} sentence The current sentence.
 * @returns {Object|null} The sentence, the words composing the ambiguous construction (empty if none found), as well as the two alternative readings.
 */

function getReadings( tagger, sentence ) {
	const words = getWords( sentence, false );
	const tags = tagger.tag( words );

	// Convert the tags to a string so that we can more easily apply a regular expression.
	const tagString = tags.map( tag => "<" + tag[ 1 ] + ">" ).join( "" );
	// Checks if the match
	const match = tagString.match( ppAttachmentRegExp );

	const construction = [];
	const reading1 = [];
	const reading2 = [];
	if ( match !== null ) {
		const indexStart = match.index;
		const indexFinal = indexStart + match[ 0 ].length;
		let indexCurrent = 0;
		let afterPreposition = false;
		tags.forEach( tag => {
			if ( indexStart <= indexCurrent && indexCurrent < indexFinal ) {
				const wordCurrent = tag[ 0 ];
				const tagCurrent = tag[ 1 ];
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
						} else {
							reading1.push( "*" );
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
 * Finds all sentences with (problematic) PP attachment.
 *
 * @param {string[]} sentences The sentences in the text.
 * @param {Researcher} researcher The researcher to use for analysis.
 * @returns {Promise} (potentially) syntactically ambiguous sentences.
 */
async function findPPAttachment( sentences, researcher ) {
	const ambiguousSentences = [];

	const tagger = researcher.getHelper( "getTagger" )();

	await Promise.all( sentences.map( async( sentence ) => {
		const result = getReadings( tagger, sentence );
		if ( result !== null ) {
			// result.hitsReading1 = getHits( result.reading1 );
			// result.hitsReading2 = getHits( result.reading2 );

			ambiguousSentences.push( result );
		}
	} ) );

	return ambiguousSentences;
}

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 * @returns {Object[]} The ambiguous constructions from the text.
 */
export default async function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const sentences = getSentences( paper.getText(), memoizedTokenizer );

	return await findPPAttachment( sentences, researcher );
}
