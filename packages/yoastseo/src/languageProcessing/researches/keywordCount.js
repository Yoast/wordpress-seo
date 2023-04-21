import { flattenDeep, min, flatten, map, uniq } from "lodash-es";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import matchWordFormsWithTokens, { matchTokensWithWordForms } from "../helpers/match/matchWordFormsWithTokens";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { collectMarkingsInSentence, markWordsInASentence } from "../helpers/word/markWordsInSentences";
import Mark from "../../values/Mark";
import addWordBoundary from "../helpers/word/addWordboundary";
import { replaceTurkishIsMemoized } from "../helpers/transliterate/specialCharacterMappings";
import transliterate from "../helpers/transliterate/transliterate";
import transliterateWP from "../helpers/transliterate/transliterateWPstyle";
import stripSpaces from "../helpers/sanitize/stripSpaces";
import { punctuationMatcher } from "../helpers/sanitize/removePunctuation";
import { tokenizerSplitter } from "../../parse/language/LanguageProcessor";
import { normalizeSingle } from "../helpers/sanitize/quotes";
import Token from "../../parse/structure/Token";
import matchTextWithWord from "../helpers/match/matchTextWithWord";


/**
 * Creates a regex from the keyword with included wordboundaries.
 *
 * @param {string} keyword  The keyword to create a regex from.
 * @param {string} locale   The locale.
 *
 * @returns {RegExp} Regular expression of the keyword with word boundaries.
 */
const toRegex = function( keyword, locale ) {
	keyword = addWordBoundary( keyword, false, "", locale );
	return new RegExp( keyword, "ig" );
};

/**
 * Matches a string with and without transliteration.
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
const matchTextWithTransliteration = function( text, keyword, locale ) {
	let keywordRegex = toRegex( keyword, locale );

	if ( locale === "tr_TR" ) {
		const turkishMappings = replaceTurkishIsMemoized( keyword );
		keywordRegex = new RegExp( turkishMappings.map( x => addWordBoundary( x ) ).join( "|" ), "ig" );
	}
	const matches = text.match( keywordRegex );

	return !! matches;
};


const matchHead = ( head, token ) => {
	if ( head.includes( token.text ) ) {
		return true;
	}
	return head.some( keyword => {
		return matchTextWithTransliteration( token.text, keyword, "en_US" ); // TODO get locale from params
	} );
};

const tokenizeKeyphraseForms = ( keyphraseForms ) => {
	let tokenizedKeyPhraseForms = keyphraseForms.map( keyphraseForm => {
		return keyphraseForm.map( word => {
			return word.split( tokenizerSplitter ).filter( x => x !== "" );
		} );
	} );
	tokenizedKeyPhraseForms = tokenizedKeyPhraseForms.map( x => x[ 0 ] );


	// source: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
	return tokenizedKeyPhraseForms[ 0 ].map( ( _, index ) => uniq( tokenizedKeyPhraseForms.map( row => row[ index ] ) ) );
};

// TODO: better descriptor than process
const processKeyphraseForms = ( keyphraseForms ) => {
	const newKeyphraseForms = [];
	keyphraseForms.forEach( word => {
		// const newWord = []
		const tokenizedWord = word.map( form => {
			return form.split( tokenizerSplitter );
		} );

		const tokenizedWordTransposed = tokenizedWord[ 0 ].map( ( _, index ) => uniq( tokenizedWord.map( row => row[ index ] ) ) );

		tokenizedWordTransposed.forEach( newWord => newKeyphraseForms.push( newWord ) );
	} );
	return newKeyphraseForms;
};

const getMatchesInTokens = ( keyphraseForms, tokens ) => {
	const result = {
		primaryMatches: [],
		secondaryMatches: [],
	};

	// Index is the ith word from the wordforms. It indicates which word we are currently analyzing.
	let keyPhraseFormsIndex = 0;
	// positionInSentence keeps track of what word in the sentence we are currently at.
	let positionInSentence = 0;  // TODO: rename naar sentencePosition

	let foundWords = [];
	// eslint-disable-next-line no-constant-condition
	while ( true ) {
		const head = keyphraseForms[ keyPhraseFormsIndex ];

		const foundPosition = tokens.slice( positionInSentence ).findIndex( t => matchHead( head, t ) );
		// If an occurence of a word is found, see if the subsequent word also is find.
		if ( foundPosition >= 0 ) {
			if ( keyPhraseFormsIndex > 0 ) {
				// if there are non keywords between two found keywords reset.

				const previousHead = keyphraseForms[ Math.max( 0, keyPhraseFormsIndex - 1 ) ]; // TODO: better way to extract previoushead.
				if ( tokens.slice( positionInSentence, foundPosition + positionInSentence ).some(
					t => {
						return previousHead.includes( t.text ); // TODO: use matchhead
					} ) ) {
					result.secondaryMatches.push(  tokens[ positionInSentence - 1 ] );
					keyPhraseFormsIndex = 0;
					foundWords = [];
					continue;
				}
			}

			keyPhraseFormsIndex += 1;
			positionInSentence += foundPosition;
			foundWords.push( tokens[ positionInSentence ] );
			positionInSentence += 1;
		} else {
			if ( keyPhraseFormsIndex === 0 ) {
				break;
			}
			keyPhraseFormsIndex = 0;
		}

		if ( foundWords.length >= keyphraseForms.length ) {
			result.primaryMatches.push( foundWords );
			keyPhraseFormsIndex = 0;
			foundWords = [];
		}
	}
	console.log( result );
	return result;
};

/**
 * Gets the matched keyphrase form(s).
 *
 * @param {string} sentence The sentence to check.
 * @param {Array} keyphraseForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {Array} The array of matched keyphrase form(s).
 */
function getMatchesInSentence( sentence, keyphraseForms, locale,  matchWordCustomHelper ) {
	if ( matchWordCustomHelper ) {
		// TODO: unify return types and forms.
		const matches = keyphraseForms.map( forms => matchTextWithArray( sentence.text,  forms, locale, matchWordCustomHelper ) );

		console.log( { primaryMatches: matches.matches, secondaryMatches: [], position: matches.position } );
		const matchesAsTokens = matches.map( match => {
			const count = match.count;
			const firstPosition = match.position;

			const moreMatches = match.matches;
		} );
		//
		// }


		return { primaryMatches: matches.matches, secondaryMatches: [], position: matches.position };
	}

	const tokens = sentence.tokens;

	const newKeyphraseForms = processKeyphraseForms( keyphraseForms, locale );

	const matches = getMatchesInTokens( newKeyphraseForms, tokens );
	console.log( matches );
	return matches;
}

const markStart = "<yoastmark class='yoast-text-mark'>";
const markEnd = "</yoastmark>";

const createMarksForSentence = ( sentence, matches ) => {
	const reference = sentence.sourceCodeRange.startOffset;
	let sentenceText = sentence.text;

	let allMatches = flatten( matches.primaryMatches );
	if ( matches.primaryMatches.length > 0 ) {
		allMatches = allMatches.concat( matches.secondaryMatches ).sort( function( a, b ) {
			return a.sourceCodeRange.startOffset - b.sourceCodeRange.startOffset;
		} );
	}

	for ( let i = allMatches.length - 1; i >= 0; i-- ) {
		const match = allMatches[ i ];

		sentenceText = sentenceText.substring( 0, match.sourceCodeRange.endOffset - reference ) + markEnd +
			sentenceText.substring( match.sourceCodeRange.endOffset - reference );
		sentenceText = sentenceText.substring( 0, match.sourceCodeRange.startOffset - reference ) + markStart +
			sentenceText.substring( match.sourceCodeRange.startOffset - reference );
	}

	sentenceText = sentenceText.replace( new RegExp( "</yoastmark>( ?)<yoastmark class='yoast-text-mark'>", "ig" ), "$1" );

	return sentenceText;
};

/**
 * Gets the Mark objects of all keyphrase matches.
 *
 * @param {string} sentence The sentence to check.
 * @param {Array} matchesInSentence The array of keyphrase matches in the sentence.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {Mark[]}    The array of Mark objects of the keyphrase matches.
 */
function getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper ) {
	const markedSentence = createMarksForSentence( sentence, matchesInSentence );
	const markings = matchesInSentence.primaryMatches.map( match => {
		return new Mark( {
			position: {
				startOffset: match.slice( 0 )[ 0 ].sourceCodeRange.startOffset,
				endOffset: match.slice( -1 )[ 0 ].sourceCodeRange.endOffset,
			},
			marked: markedSentence,
			original: sentence.text,

		} );
	} );

	if ( matchesInSentence.primaryMatches.length > 0 ) {
		matchesInSentence.secondaryMatches.forEach( match =>{
			markings.push( new Mark( {
				position: {
					startOffset: match.sourceCodeRange.startOffset,
					endOffset: match.sourceCodeRange.endOffset,
				},
				marked: markedSentence,
				original: sentence.text,

			} ) );
		}
		);
	}

	return markings;
}

/**
 * Merges consecutive markings into one marking.
 * @param {[]} markings
 * @returns {*[]}
 */
const mergeConsecutiveMarkings = ( markings ) => {
	const newMarkings = [];
	markings.forEach( ( marking ) => {
		let actionDone = false;
		newMarkings.forEach( ( newMarking, newMarkingIndex ) => {
			if ( newMarking.getPositionEnd() + 1 === marking.getPositionStart() ) {
				newMarkings[ newMarkingIndex ]._properties.position.endOffset = marking.getPositionEnd();
				actionDone = true;
			} else if ( newMarking.getPositionStart() === marking.getPositionEnd() + 1 ) {
				newMarkings[ newMarkingIndex ]._properties.position.startOffset = marking.getPositionStart();
				actionDone = true;
			}
		} );
		if ( ! actionDone ) {
			newMarkings.push( marking );
		}
	} );
	return newMarkings;
};

/**
 * Counts the occurrences of the keyphrase in the text and creates the Mark objects for the matches.
 *
 * @param {Array} sentences The sentences to check.
 * @param {Array} topicForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {{markings: Mark[], count: number}} The number of keyphrase occurrences in the text and the Mark objects of the matches.
 */
export function countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper ) {
	const result = { count: 0, markings: [] };

	sentences.forEach( sentence => {
		const matchesInSentence = getMatchesInSentence( sentence, topicForms.keyphraseForms, locale, matchWordCustomHelper );

		const markings = getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper );

		result.markings.push( markings ); // TODO: add test for multiple sentences
		result.count += matchesInSentence.primaryMatches.length;
	} );

	return result;
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An object containing an array of all the matches, markings and the keyphrase count.
 */
export default function keyphraseCount( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );

	topicForms.keyphraseForms = topicForms.keyphraseForms.map( word => word.map( form => normalizeSingle( form ) ) );

	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );

	const locale = paper.getLocale();

	const sentences = getSentencesFromTree( paper );
	const keyphraseFound = countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper );

	return {
		count: keyphraseFound.count,
		markings: flatten( keyphraseFound.markings ),
		length: topicForms.keyphraseForms.length,
	};
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @deprecated Since version 20.8. Use keywordCountInSlug instead.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An array of all the matches, markings and the keyphrase count.
 */
export function keywordCount( paper, researcher ) {
	console.warn( "This function is deprecated, use keyphraseCount instead." );
	return keyphraseCount( paper, researcher );
}
