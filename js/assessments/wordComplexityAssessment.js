var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var removeSentenceTerminators = require( "../stringProcessing/removeSentenceTerminators" );
var removePunctuation = require( "../stringProcessing/removePunctuation.js" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

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
	var tooComplexWords = filterComplexity( wordComplexity ).length;
	var percentage = ( tooComplexWords / wordCount ) * 100;
	percentage = fixFloatingPoint( percentage );
	var hasMarks = ( percentage > 0 );
	var recommendedMaximum = 10;
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps. each step i 0.6
	// Up to 6.7 percent is for scoring a 9, higher percentages give lower scores.
	var score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 6.7 ), 6 ), 0 );
	score = fixFloatingPoint( score );

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// Translators: %1$s expands to the percentage of complex words, %2$d expands to the recommended number of syllables,
					// %3$s expands to the recommend maximum
					"%1$s of the words contain over %2$d syllables, which is less than or equal to the recommended maximum of %3$s." ),
				percentage + "%", recommendedValue, recommendedMaximum + "%"  )
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// Translators: %1$s expands to the percentage of too complex words, %2$d expands to the recommended number of syllables
				// %3$s expands to the recommend maximum
				"%1$s of the words contain over %2$d syllables, which is more than the recommended maximum of %3$s." ),
			percentage + "%", recommendedValue, recommendedMaximum + "%" )
	};
};

/**
 * Creates markers of words that are complex.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @returns {Array} A list with markers
 */
var wordComplexityMarker = function( paper, researcher ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	var complexWords = filterComplexity( wordComplexity );
	return map( complexWords, function( complexWord ) {
		complexWord.word = removeSentenceTerminators( complexWord.word );
		complexWord.word = removePunctuation( complexWord.word );

		return new Mark( {
			original: complexWord.word,
			marked:  addMark( complexWord.word )
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
	getMarks: wordComplexityMarker
};
