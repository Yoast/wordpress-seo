import { __, sprintf } from "@wordpress/i18n";
import { filter, flatMap, flatten, forEach, zip } from "lodash-es";

import formatNumber from "../../../helpers/formatNumber";
import addMark from "../../../markers/addMark";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import removeSentenceTerminators from "../../../languageProcessing/helpers/sanitize/removeSentenceTerminators";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import hasEnoughContent from "../../helpers/assessments/hasEnoughContent";

// The maximum recommended value is 3 syllables. With more than 3 syllables a word is considered complex.
const recommendedValue = 3;

/**
 * Filters the words that aren't too long.
 *
 * @param {Array} words The array with words to filter on complexity.
 *
 * @returns {Array} The filtered list with complex words.
 */
const filterComplexity = function( words ) {
	return filter( words, function( word ) {
		return ( word.complexity > recommendedValue );
	} );
};

/**
 * Calculates the complexity of the text based on the syllables in words.
 *
 * @param {number}  wordCount       The number of words used.
 * @param {Array}   wordComplexity  The list of words with their syllable count.
 *
 * @returns {{score: number, text}} resultobject with score and text.
 */
const calculateComplexity = function( wordCount, wordComplexity ) {
	let percentage = 0;
	const tooComplexWords = filterComplexity( wordComplexity ).length;

	// Prevent division by zero errors.
	if ( wordCount !== 0 ) {
		percentage = ( tooComplexWords / wordCount ) * 100;
	}

	percentage = formatNumber( percentage );
	const hasMarks = ( percentage > 0 );
	const recommendedMaximum = 5;
	const wordComplexityURL = createAnchorOpeningTag( "https://yoa.st/difficult-words" );
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps. each step is 0.6
	// Up to 1.7 percent is for scoring a 9, higher percentages give lower scores.
	let score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 1.7 ), 6 ), 0 );
	score = formatNumber( score );

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: sprintf(
				// Translators: %1$s expands to the percentage of complex words, %2$s expands to a link on yoast.com,
				// %3$d expands to the recommended maximum number of syllables,
				// %4$s expands to the anchor end tag, %5$s expands to the recommended maximum number of syllables.
				__(
					"%1$s of the words contain %2$sover %3$s syllables%4$s, which is less than or equal to the recommended maximum of %5$s.",
					"wordpress-seo"
				),
				percentage + "%", wordComplexityURL, recommendedValue, "</a>", recommendedMaximum + "%"  ),
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,
		text: sprintf(
			// Translators: %1$s expands to the percentage of complex words, %2$s expands to a link on yoast.com,
			// %3$d expands to the recommended maximum number of syllables,
			// %4$s expands to the anchor end tag, %5$s expands to the recommended maximum number of syllables.
			__(
				"%1$s of the words contain %2$sover %3$s syllables%4$s, which is more than the recommended maximum of %5$s.",
				"wordpress-seo"
			),
			percentage + "%", wordComplexityURL, recommendedValue, "</a>", recommendedMaximum + "%"  ),
	};
};

/**
 * Marks complex words in a sentence.
 *
 * @param {string} sentence     The sentence to mark complex words in.
 * @param {Array} complexWords  The array with complex words.
 *
 * @returns {Array} All marked complex words.
 */
const markComplexWordsInSentence = function( sentence, complexWords ) {
	const splitWords = sentence.split( /\s+/ );

	forEach( complexWords, function( complexWord ) {
		const wordIndex = complexWord.wordIndex;

		if ( complexWord.word === splitWords[ wordIndex ] ||
			complexWord.word === removeSentenceTerminators( splitWords[ wordIndex ] ) ) {
			splitWords[ wordIndex ] = splitWords[ wordIndex ].replace( complexWord.word, addMark( complexWord.word ) );
		}
	} );
	return splitWords;
};

/**
 * Splits sentence on whitespace.
 *
 * @param {string} sentence The sentence to split.
 *
 * @returns {Array} All words from sentence. .
 */
const splitSentenceOnWhitespace = function( sentence ) {
	const whitespace = sentence.split( /\S+/ );

	// Drop first and last elements.
	whitespace.pop();
	whitespace.shift();

	return whitespace;
};

/**
 * Creates markers of words that are complex.
 *
 * @param {Paper}       paper       The Paper object to assess.
 * @param {Researcher}  researcher  The Researcher object containing all available researches.
 *
 * @returns {Array} A list with markers
 */
const wordComplexityMarker = function( paper, researcher ) {
	const wordComplexityResults = researcher.getResearch( "wordComplexity" );

	return flatMap( wordComplexityResults, function( result ) {
		const words = result.words;
		const sentence = result.sentence;

		const complexWords = filterComplexity( words );

		if ( complexWords.length === 0 ) {
			return [];
		}

		const splitWords = markComplexWordsInSentence( sentence, complexWords );

		const whitespace = splitSentenceOnWhitespace( sentence );

		// Rebuild the sentence with the marked words.
		let markedSentence = zip( splitWords, whitespace );
		markedSentence = flatten( markedSentence );
		markedSentence = markedSentence.join( "" );

		return new Mark( {
			original: sentence,
			marked: markedSentence,
		} );
	} );
};

/**
 * Execute the word complexity assessment and return a result based on the syllables in words.
 *
 * @param {Paper}       paper       The Paper object to assess.
 * @param {Researcher}  researcher  The Researcher object containing all available researches.
 *
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
const wordComplexityAssessment = function( paper, researcher ) {
	let wordComplexity = researcher.getResearch( "wordComplexity" );
	wordComplexity = flatMap( wordComplexity, function( sentence ) {
		return sentence.words;
	} );
	const wordCount = wordComplexity.length;

	const complexityResult = calculateComplexity( wordCount, wordComplexity );
	const assessmentResult = new AssessmentResult();
	assessmentResult.setScore( complexityResult.score );
	assessmentResult.setText( complexityResult.text );
	assessmentResult.setHasMarks( complexityResult.hasMarks );
	return assessmentResult;
};

/**
 * Checks whether the paper has text.
 *
 * @param {Paper}       paper       The paper to use for the assessment.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {boolean} True when there is text.
 */
const isApplicable = function( paper, researcher ) {
	return hasEnoughContent( paper ) && researcher.hasResearch( "wordComplexity" );
};

export default {
	identifier: "wordComplexity",
	getResult: wordComplexityAssessment,
	isApplicable: isApplicable,
	getMarks: wordComplexityMarker,
};
