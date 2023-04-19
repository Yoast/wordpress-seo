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
		return matchTextWithTransliteration( token.text, keyword, "en_US" );
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
		return keyphraseForms.map( forms => matchTextWithArray( sentence.text,  forms, locale, matchWordCustomHelper ) );
	}
	const result = [];
	const tokens = sentence.tokens;
	let index = 0;
	let initialPosition = 0;

	const newKeyphraseForms = [];
	keyphraseForms.forEach( word => {
		// const newWord = []
		const tokenizedWord = word.map( form => {
			return form.split( tokenizerSplitter );
		} );

		const tokenizedWordTransposed = tokenizedWord[ 0 ].map( ( _, index ) => uniq( tokenizedWord.map( row => row[ index ] ) ) );

		tokenizedWordTransposed.forEach( newWord => newKeyphraseForms.push( newWord ) );
	} );

	let foundWords = [];
	// eslint-disable-next-line no-constant-condition
	while ( true ) {
		const head = newKeyphraseForms[ index ];

		const foundPosition = tokens.slice( initialPosition ).findIndex( t => matchHead( head, t ) );

		if ( foundPosition >= 0 ) {
			if ( index > 0 ) {
				// if there are non keywords between two found keywords reset.

				if ( tokens.slice( initialPosition, foundPosition + initialPosition ).some(
					t => ( t.text.trim() !== "" && t.text.trim() !== "-" ) ) ) {
					index = 0;
					foundWords = [];
					continue;
				}
			}

			index += 1;
			initialPosition += foundPosition;
			foundWords.push( tokens[ initialPosition ] );
			initialPosition += 1;
		} else {
			if ( index === 0 ) {
				break;
			}
			index = 0;
		}

		if ( foundWords.length >= newKeyphraseForms.length ) {
			result.push( foundWords );
			index = 0;
			foundWords = [];
		}
	}

	return result;
}

const markStart = "<yoastmark class='yoast-text-mark'>";
const markEnd = "</yoastmark>";

const createMarksForSentence = ( sentence, matches ) => {
	const reference = sentence.sourceCodeRange.startOffset;
	let sentenceText = sentence.text;

	for ( let i = matches.length - 1; i >= 0; i-- ) {
		const match = matches[ i ];
		const startmarkPosition = match.slice( 0 )[ 0 ].sourceCodeRange.startOffset - reference;
		const endmarkPosition = match.slice( -1 )[ 0 ].sourceCodeRange.endOffset - reference;
		sentenceText = sentenceText.substring( 0, endmarkPosition ) + markEnd + sentenceText.substring( endmarkPosition );
		sentenceText = sentenceText.substring( 0, startmarkPosition ) + markStart + sentenceText.substring( startmarkPosition );
	}

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
	const markings = matchesInSentence.map( match => {
		return new Mark( {
			position: {
				startOffset: match.slice( 0 )[ 0 ].sourceCodeRange.startOffset,
				endOffset: match.slice( -1 )[ 0 ].sourceCodeRange.endOffset,
			},
			marked: markedSentence,
			original: sentence.text,

		} );
	} );
	return markings;
}

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
	return sentences.reduce( ( acc, sentence ) => {
		const matchesInSentence = getMatchesInSentence( sentence, topicForms.keyphraseForms, locale, matchWordCustomHelper );
		let markings = getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper );

		markings = mergeConsecutiveMarkings( markings );

		return {
			count: markings.length,
			markings: acc.markings.concat( markings ),
		};
	}, {
		count: 0,
		markings: [],
	} );
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
	// console.log(topicForms);
	// const processedTopicForms = topicForms.map(word => word.map(form => normalizeSingle(form)))

	// console.log(processedTopicForms);

	// A helper to return all the matches for the keyphrase.
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
