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
import { getLanguage } from "../index";


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

// TODO: better descriptor than `process`
/**
 * Processes the keyphrase forms to make sure that they are tokenized in the same way as the text.
 * @param {array[]} keyphraseForms The keyphrase forms to process.
 * @returns {*[]} The processed keyphrase forms.
 */
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

/**
 * Matches the keyphrase forms in an array of tokens.
 * @param {array[]} keyphraseForms The keyphrase forms to match.
 * @param {Token[]} tokens The tokens to match the keyphrase forms in.
 * @returns {{primaryMatches: *[], secondaryMatches: *[]}} The matches.
 */
const getMatchesInTokens = ( keyphraseForms, tokens ) => {
	const result = {
		primaryMatches: [],
		secondaryMatches: [],
	};

	// Index is the ith word from the wordforms. It indicates which word we are currently analyzing.
	let keyPhraseFormsIndex = 0;
	// positionInSentence keeps track of what word in the sentence we are currently at.
	let positionInSentence = 0;  // TODO: rename naar sentencePosition?

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

	return result;
};

/**
 * Gets all indices of a word in a sentence.
 * @param {string} word The word.
 * @param {Sentence} sentence The sentence.
 * @returns {array} The indices.
 */
const getAllIndicesOfWord = ( word, sentence ) => {
	// TODO: more fuzzy matching. Agnostic to capitalization.
	const text = sentence.text;

	// get all the indices of the word in the sentence.
	const indices = [];
	let index = text.indexOf( word );
	while ( index > -1 ) {
		indices.push( index );
		index = text.indexOf( word, index + 1 );
	}

	return indices;
	// return sentence.text.split( "" ).map( ( x, i ) => x === word ? i : "" ).filter( Boolean );
};

/**
 * Converts the matches to the format that is used in the assessment.
 * @param {array} matches The matches.
 * @param {Sentence} sentence The sentence.
 * @returns {{primaryMatches: *[], secondaryMatches: *[], position: number}} The matches in the format that is used in the assessment.
 */
const convertToPositionResult = ( matches, sentence, keyPhraseForms ) => {
	const result = { primaryMatches: [], secondaryMatches: [], position: 0 };
	const matchTokens = [];
	matches.forEach( matchObject => {
		const matchWords = matchObject.matches;

		uniq( matchWords ).forEach( matchWord => {
			const indices = getAllIndicesOfWord( matchWord, sentence );
			indices.forEach( index => {
				const startOffset = sentence.sourceCodeRange.startOffset + index;
				const endOffset = sentence.sourceCodeRange.startOffset + index + matchWord.length;

				const matchToken = new Token( matchWord, { startOffset: startOffset, endOffset: endOffset } );

				matchTokens.push( matchToken );
			} );
		} );
	} );

	// Sort tokens on startOffset.
	matchTokens.sort( ( a, b ) => a.sourceCodeRange.startOffset - b.sourceCodeRange.startOffset );

	const primaryMatches = [];
	const secondaryMatches = [];

	let currentMatch = [];
	let keyPhraseFormsIndex = 0;

	// A primary match is a match that contains all the keyphrase forms in the same order as they occur in the keyphrase.
	// A secondary match is any other match.
	matchTokens.forEach( ( token, index ) => {
		const head = keyPhraseForms[ keyPhraseFormsIndex ];
		if ( head && matchHead( head, token ) ) {
			currentMatch.push( token );
			keyPhraseFormsIndex += 1;
			if ( currentMatch.length === keyPhraseForms.length ) {
				primaryMatches.push( currentMatch );
				currentMatch = [];
				keyPhraseFormsIndex = 0;
			}
		} else {
			if ( currentMatch.length > 0 ) {
				if ( currentMatch.length === keyPhraseForms.length ) {
					primaryMatches.push( currentMatch );
				} else {
					secondaryMatches.push( currentMatch );
				}
			} else {
				secondaryMatches.push( [ token ] );
			}
			currentMatch = [];
			keyPhraseFormsIndex = 0;
		}
	} );


	return {
		primaryMatches: primaryMatches,
		secondaryMatches: secondaryMatches,
		position: 0,
	};
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
	let matches, result;

	if ( matchWordCustomHelper ) {
		matches = keyphraseForms.map( forms => matchTextWithArray( sentence.text,  forms, locale, matchWordCustomHelper ) );
		// If one of the forms is not found, return an empty result.
		if ( matches.some( match => match.position === -1 ) ) {
			return { primaryMatches: [], secondaryMatches: [], position: -1 };
		}

		result = convertToPositionResult( matches, sentence, keyphraseForms );

		return result;
	}

	const tokens = sentence.tokens;

	const newKeyphraseForms = processKeyphraseForms( keyphraseForms, locale );

	matches = getMatchesInTokens( newKeyphraseForms, tokens );

	return matches;
}

const markStart = "<yoastmark class='yoast-text-mark'>";
const markEnd = "</yoastmark>";

/**
 * Create marks for a sentence. This function creates marks for the (old) search based highlighting.
 * @param {Sentence[]} sentence The sentence to which to apply the marks.
 * @param {{}[]} matches The matches to apply.
 * @returns {string} The sentence with marks applied.
 */
const createMarksForSentence = ( sentence, matches ) => {
	const reference = sentence.sourceCodeRange.startOffset;
	let sentenceText = sentence.text;

	let allMatches = flatten( matches.primaryMatches );
	if ( matches.primaryMatches.length > 0 ) {
		allMatches = allMatches.concat( flatten( matches.secondaryMatches ) ).sort( function( a, b ) {
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
 * Merges consecutive markings into one marking.
 * @param {{}[]} markings An array of markings to merge.
 * @returns {{}[]} An array of markings where consecutive markings are merged.
 */
const mergeConsecutiveMarkings = ( markings, isJapanese = false ) => {
	const newMarkings = [];
	markings.forEach( ( marking ) => {
		let actionDone = false;
		newMarkings.forEach( ( newMarking, newMarkingIndex ) => {
			// If the markings are consecutive, merge them.
			if ( newMarking.getPositionEnd() + ( isJapanese ? 0 : 1 ) === marking.getPositionStart() ) {
				newMarkings[ newMarkingIndex ]._properties.position.endOffset = marking.getPositionEnd();
				actionDone = true;
			// if the markings are overlapping, merge them.
			} else if ( newMarking.getPositionEnd() >= marking.getPositionStart() && newMarking.getPositionStart() <= marking.getPositionEnd() ) {
				newMarkings[ newMarkingIndex ]._properties.position.startOffset = Math.min( newMarking.getPositionStart(), marking.getPositionStart() );
				newMarkings[ newMarkingIndex ]._properties.position.endOffset = Math.max( newMarking.getPositionEnd(), marking.getPositionEnd() );
				actionDone = true;
			// If the markings are consecutive, merge them.
			} else if ( newMarking.getPositionStart() === marking.getPositionEnd() + (isJapanese ? 0 : 1 ) ) {
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
 * Gets the Mark objects of all keyphrase matches.
 *
 * @param {string} sentence The sentence to check.
 * @param {Array} matchesInSentence The array of keyphrase matches in the sentence.
 *
 * @returns {Mark[]}    The array of Mark objects of the keyphrase matches.
 */
function getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper, locale ) {
	const markedSentence = createMarksForSentence( sentence, matchesInSentence );
	const markings = matchesInSentence.primaryMatches.flatMap( match => {
		return  match.map( token => {
			return new Mark( {
				position: {
					startOffset: token.sourceCodeRange.startOffset,
					endOffset: token.sourceCodeRange.endOffset,
				},
				marked: markedSentence,
				original: sentence.text,
			} );
		} );
	} );

	if ( matchesInSentence.primaryMatches.length > 0 ) {
		flatten( matchesInSentence.secondaryMatches ).forEach( match =>{
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
	const mergedMarkings = mergeConsecutiveMarkings( markings, getLanguage( locale ) === "ja" );
	return mergedMarkings;
}


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

		const markings = getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper, locale );

		result.markings.push( markings );
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
