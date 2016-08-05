var AssessmentResult = require( "../values/AssessmentResult.js" );
var removeSentenceTerminators = require( "../stringProcessing/removeSentenceTerminators" );
var formatNumber = require( "../helpers/formatNumber.js" );
var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

var filter = require( "lodash/filter" );
var flatMap = require( "lodash/flatMap" );
var zip = require( "lodash/zip" );
var forEach = require( "lodash/forEach" );
var flatten = require( "lodash/flatten" );

// The maximum recommended value is 3 syllables. With more than 3 syllables a word is considered complex.
var recommendedValue = 3;

/**
 * Filters the words that aren't too long.
 *
 * @param {Array} words The array with words to filter on complexity.
 * @returns {Array} The filtered list with complex words.
 */
var filterComplexity = function( words ) {
	return filter( words, function( word ) {
		return( word.complexity > recommendedValue );
	} );
};

/**
 * Calculates the complexity of the text based on the syllables in words.
 * @param {number} wordCount The number of words used.
 * @param {Array} wordComplexity The list of words with their syllable count.
 * @param {Object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculateComplexity = function( wordCount, wordComplexity, i18n ) {
	var percentage = 0;
	var tooComplexWords = filterComplexity( wordComplexity ).length;

	// Prevent division by zero errors.
	if ( wordCount !== 0 ) {
		percentage = ( tooComplexWords / wordCount ) * 100;
	}

	percentage = formatNumber( percentage );
	var hasMarks = ( percentage > 0 );
	var recommendedMaximum = 5;
	var wordComplexityURL = "<a href='https://yoa.st/difficult-words' target='_blank'>";
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps. each step is 0.6
	// Up to 1.7 percent is for scoring a 9, higher percentages give lower scores.
	var score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 1.7 ), 6 ), 0 );
	score = formatNumber( score );

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",

					// Translators: %1$s expands to the percentage of complex words, %2$s expands to a link on yoast.com,
					// %3$d expands to the recommended maximum number of syllables,
					// %4$s expands to the anchor end tag, %5$s expands to the recommended maximum number of syllables.
					"%1$s of the words contain %2$sover %3$s syllables%4$s, " +
					"which is less than or equal to the recommended maximum of %5$s." ),
				percentage + "%", wordComplexityURL, recommendedValue, "</a>", recommendedMaximum + "%"  ),
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",

				// Translators: %1$s expands to the percentage of complex words, %2$s expands to a link on yoast.com,
				// %3$d expands to the recommended maximum number of syllables,
				// %4$s expands to the anchor end tag, %5$s expands to the recommended maximum number of syllables.
				"%1$s of the words contain %2$sover %3$s syllables%4$s, " +
				"which is more than the recommended maximum of %5$s." ),
			percentage + "%", wordComplexityURL, recommendedValue, "</a>", recommendedMaximum + "%"  ),
	};
};

/**
 * Marks complex words in a sentence.
 * @param {string} sentence The sentence to mark complex words in.
 * @param {Array} complexWords The array with complex words.
 * @returns {Array} All marked complex words.
 */
var markComplexWordsInSentence = function( sentence, complexWords ) {
	var splitWords = sentence.split( /\s+/ );

	forEach( complexWords, function( complexWord ) {
		var wordIndex = complexWord.wordIndex;

		if ( complexWord.word === splitWords[ wordIndex ]
			|| complexWord.word === removeSentenceTerminators( splitWords[ wordIndex ] ) ) {
			splitWords[ wordIndex ] = splitWords[ wordIndex ].replace( complexWord.word, addMark( complexWord.word ) );
		}
	} );
	return splitWords;
};

/**
 * Splits sentence on whitespace
 * @param {string} sentence The sentence to split.
 * @returns {Array} All words from sentence. .
 */
var splitSentenceOnWhitespace = function( sentence ) {
	var whitespace = sentence.split( /\S+/ );

	// Drop first and last elements.
	whitespace.pop();
	whitespace.shift();

	return whitespace;
};

/**
 * Creates markers of words that are complex.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @returns {Array} A list with markers
 */
var wordComplexityMarker = function( paper, researcher ) {
	var wordComplexityResults = researcher.getResearch( "wordComplexity" );

	return flatMap( wordComplexityResults, function( result ) {
		var words = result.words;
		var sentence = result.sentence;

		var complexWords = filterComplexity( words );

		if ( complexWords.length === 0 ) {
			return [];
		}

		var splitWords = markComplexWordsInSentence( sentence, complexWords );

		var whitespace = splitSentenceOnWhitespace( sentence );

		// Rebuild the sentence with the marked words.
		var markedSentence = zip( splitWords, whitespace );
		markedSentence = flatten( markedSentence );
		markedSentence = markedSentence.join( "" );

		return new Mark( {
			original: sentence,
			marked: markedSentence,
		} );
	} );
};

/**
 * Execute the word complexity assessment and return a result based on the syllables in words
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The object used for translations
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var wordComplexityAssessment = function( paper, researcher, i18n ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	wordComplexity = flatMap( wordComplexity, function( sentence ) {
		return sentence.words;
	} );
	var wordCount = wordComplexity.length;

	var complexityResult = calculateComplexity( wordCount, wordComplexity, i18n );
	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( complexityResult.score );
	assessmentResult.setText( complexityResult.text );
	assessmentResult.setHasMarks( complexityResult.hasMarks );
	return assessmentResult;
};

module.exports = {
	identifier: "wordComplexity",
	getResult: wordComplexityAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	},
	getMarks: wordComplexityMarker,
};
