import { flattenDeep, min, flatten } from "lodash-es";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import matchWordFormsWithTokens, { matchTokensWithWordForms } from "../helpers/match/matchWordFormsWithTokens";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { collectMarkingsInSentence, markWordsInASentence } from "../helpers/word/markWordsInSentences";
import Mark from "../../values/Mark";

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
		const head = keyphraseForms[ index ];
		const foundPosition = tokens.slice( initailPosition ).findIndex( t => head.includes( t.text ) );

		if ( foundPosition >= 0 ) {
			if ( index > 0 ) {
				if ( tokens.slice( initailPosition, foundPosition + initailPosition ).some( t => t.text.trim() !== "" ) ) {
					index = 0;
					foundWords = [];
					continue;
				}
			}

			index += 1;
			initailPosition += foundPosition;
			foundWords.push( tokens[ initailPosition ] );
			initailPosition += 1;
		} else {
			if ( index === 0 ) {
				break;
			}
			index = 0;
		}

		if ( foundWords.length >= keyphraseForms.length ) {
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
		// console.log(markings);
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
