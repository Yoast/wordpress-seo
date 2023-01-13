import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";

import fetch from "node-fetch";

// verb - zero or one determiner - zero or multiple adjectives - noun - preposition - zero or one determiner - zero or multiple adjectives - noun
const ppAttachmentRegExp = new RegExp( "<VB.?>(?:<DT>)?(?:<JJ>)*<NN.?><IN>(?:<DT>)?(?:<JJ>)*<NN.?>" );

/**
 * Checks whether a sentence has ambiguous PP attachment.
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
 * Checks if the given reading is possible according to a Google search.
 * @param {string} reading The reading.
 * @returns {boolean} Whether the reading is possible.
 */
function isPossible( reading ) {
	const cx = "cx";
	const key = "key";
	const url = "https://www.googleapis.com/customsearch/v1?";
	const parameters = { q: reading, exactTerms: reading, cx: cx, key: key, googlehost: "www.google.com" };

	fetch( url + new URLSearchParams( parameters ), { method: "GET" } )
		.then( function( response ) {
			console.log( response.json() );
		} )
		.catch( function( err ) {
			console.log( err );
		} );

	return true;
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
		const result = isAmbiguous( tagger, sentence );
		if ( result !== null ) {
			if ( isPossible( result.reading1 ) && isPossible( result.reading2 ) ) {
				ambiguousSentences.push( result );
			}
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
