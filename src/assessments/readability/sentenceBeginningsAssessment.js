import AssessmentResult from "../../values/AssessmentResult.js";
import { stripIncompleteTags as stripTags } from "../../stringProcessing/stripHTMLTags";

import { partition } from "lodash-es";
import { sortBy } from "lodash-es";
import { map } from "lodash-es";
import { filter } from "lodash-es";
import { flatten } from "lodash-es";

import Mark from "../../values/Mark.js";
import marker from "../../markers/addMark.js";

let maximumConsecutiveDuplicates = 2;

import getLanguageAvailability from "../../helpers/getLanguageAvailability.js";
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
 * @returns {{score: number, text: string, hasMarks: boolean}} result object with score and text.
 */
let calculateSentenceBeginningsResult = function( groupedSentenceBeginnings, i18n ) {
	let score;
	let urlTitle = "<a href='https://yoa.st/35f' target='_blank'>";
	let urlCallToAction = "<a href='https://yoa.st/35g' target='_blank'>";

	if ( groupedSentenceBeginnings.total > 0 ) {
		score = 3;
	} else {
		score = 9;
	}

	if ( score === 3 ) {
		return {
			score: score,
			hasMarks: true,
			text: i18n.sprintf(
				/* Translators: %1$s and %5$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
				%3$d expands to the number of consecutive sentences starting with the same word,
				%4$d expands to the number of instances where 3 or more consecutive sentences start with the same word. */
				i18n.dngettext(
					"js-text-analysis",
					"%1$sConsecutive sentences%2$s: The text contains %3$d consecutive sentences starting with the same word." +
					" %5$sTry to mix things up%2$s!", "%1$sConsecutive sentences%2$s: The text contains %4$d instances where" +
					" %3$d or more consecutive sentences start with the same word. %5$sTry to mix things up%2$s!",
					groupedSentenceBeginnings.total
				),
				urlTitle,
				"</a>",
				groupedSentenceBeginnings.lowestCount,
				groupedSentenceBeginnings.total,
				urlCallToAction
			),
		};
	}
	return {
		score: score,
		hasMarks: false,

		text: i18n.sprintf(
			/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis",
				"%1$sConsecutive sentences%2$s: There is enough variety in your sentences. That's great!" ),
			urlTitle,
			"</a>"
		),
	};
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

export default {
	identifier: "sentenceBeginnings",
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		let isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return ( isLanguageAvailable && paper.hasText() );
	},
	getMarks: sentenceBeginningMarker,
};

