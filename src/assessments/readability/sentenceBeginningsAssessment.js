let AssessmentResult = require( "../../values/AssessmentResult.js" );
let stripTags = require( "../../stringProcessing/stripHTMLTags" ).stripIncompleteTags;

let partition = require( "lodash/partition" );
let sortBy = require( "lodash/sortBy" );
let map = require( "lodash/map" );
let filter = require( "lodash/filter" );
let flatten = require( "lodash/flatten" );

let Mark = require( "../../values/Mark.js" );
let marker = require( "../../markers/addMark.js" );

let maximumConsecutiveDuplicates = 2;

let getLanguageAvailability = require( "../../helpers/getLanguageAvailability.js" );
let availableLanguages = [ "en", "de", "es", "fr", "nl", "it", "ru", "pl" ];

/**
 * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
 * @param {array} sentenceBeginnings The array containing the objects containing the beginning words and counts.
 * @returns {object} The object containing the total number of too often used beginnings and the lowest count within those.
 */
let groupSentenceBeginnings = function( sentenceBeginnings ) {
	let tooOften = partition( sentenceBeginnings, function( word ) {
		return word.count > maximumConsecutiveDuplicates;
	} );

	if ( tooOften[ 0 ].length === 0 ) {
		return { total: 0 };
	}

	let sortedCounts = sortBy( tooOften[ 0 ], function( word ) {
		return word.count;
	} );

	return { total: tooOften[ 0 ].length, lowestCount: sortedCounts[ 0 ].count };
};

/**
 * Calculates the score based on sentence beginnings.
 * @param {object} groupedSentenceBeginnings The object with grouped sentence beginnings.
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text: string, hasMarks: boolean}} resultobject with score and text.
 */
let calculateSentenceBeginningsResult = function( groupedSentenceBeginnings, i18n ) {
	if ( groupedSentenceBeginnings.total > 0 ) {
		return {
			score: 3,
			hasMarks: true,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",

					// Translators: %1$d expands to the number of instances where 3 or more consecutive sentences start with the same word.
					// %2$d expands to the number of consecutive sentences starting with the same word.
					"The text contains %2$d consecutive sentences starting with the same word. Try to mix things up!",
					"The text contains %1$d instances where %2$d or more consecutive sentences start with the same word. " +
					"Try to mix things up!",
					groupedSentenceBeginnings.total
				),
				groupedSentenceBeginnings.total, groupedSentenceBeginnings.lowestCount ),
		};
	}
	return {};
};

/**
 * Marks all consecutive sentences with the same beginnings.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {object} All marked sentences.
 */
let sentenceBeginningMarker = function( paper, researcher ) {
	let sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	sentenceBeginnings = filter( sentenceBeginnings, function( sentenceBeginning ) {
		return sentenceBeginning.count > maximumConsecutiveDuplicates;
	} );

	let sentences = map( sentenceBeginnings, function( begin ) {
		return begin.sentences;
	} );

	return map( flatten( sentences ), function( sentence ) {
		sentence = stripTags( sentence );
		let marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked,
		} );
	} );
};

/**
 * Scores the repetition of sentence beginnings in consecutive sentences.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result
 */
let sentenceBeginningsAssessment = function( paper, researcher, i18n ) {
	let sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	let groupedSentenceBeginnings = groupSentenceBeginnings( sentenceBeginnings );
	let sentenceBeginningsResult = calculateSentenceBeginningsResult( groupedSentenceBeginnings, i18n );
	let assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceBeginningsResult.score );
	assessmentResult.setText( sentenceBeginningsResult.text );
	assessmentResult.setHasMarks( sentenceBeginningsResult.hasMarks );
	return assessmentResult;
};

module.exports = {
	identifier: "sentenceBeginnings",
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		let isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return ( isLanguageAvailable && paper.hasText() );
	},
	getMarks: sentenceBeginningMarker,
};

