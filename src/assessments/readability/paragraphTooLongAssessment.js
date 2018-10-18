import { filter, map } from "lodash-es";

import { inRangeEndInclusive as inRange } from "../../helpers/inRange";
import isParagraphTooLong from "../../helpers/isValueTooLong";
import marker from "../../markers/addMark";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";
import { stripBlockTagsAtStartEnd as stripHTMLTags } from "../../stringProcessing/stripHTMLTags";
import AssessmentResult from "../../values/AssessmentResult";
import Mark from "../../values/Mark";

// 150 is the recommendedValue for the maximum paragraph length.
const recommendedValue = 150;

/**
 * Returns an array containing only the paragraphs longer than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @returns {number} The number of too long paragraphs.
 */
const getTooLongParagraphs = function( paragraphsLength  ) {
	return filter( paragraphsLength, function( paragraph ) {
		return isParagraphTooLong( recommendedValue, paragraph.wordCount );
	} );
};

/**
 * Returns the scores and text for the ParagraphTooLongAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooLongParagraphs The number of too long paragraphs.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
let calculateParagraphLengthResult = function( paragraphsLength, tooLongParagraphs, i18n ) {
	let score;
	const urlTitle = createAnchorOpeningTag( "https://yoa.st/35d" );
	const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/35e" );

	if ( paragraphsLength.length === 0 ) {
		return {};
	}

	let longestParagraphLength = paragraphsLength[ 0 ].wordCount;

	if ( longestParagraphLength <= 150 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( longestParagraphLength, 150, 200 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( longestParagraphLength > 200 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: false,

			text: i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis",
					"%1$sParagraph length%2$s: None of the paragraphs are too long. Great job!" ),
				urlTitle,
				"</a>"
			),
		};
	}
	return {
		score: score,
		hasMarks: true,
		text: i18n.sprintf(
			/* Translators: %1$s and %5$s expand to a link on yoast.com, %2$s expands to the anchor end tag, %3$d expands to the
			number of paragraphs over the recommended word limit, %4$d expands to the word limit */
			i18n.dngettext( "js-text-analysis",
				"%1$sParagraph length%2$s: %3$d of the paragraphs contains more than the recommended maximum of %4$d words." +
				" %5$sShorten your paragraphs%2$s!", "%1$sParagraph length%2$s: %3$d of the paragraphs contain more than the " +
				"recommended maximum of %4$d words. %5$sShorten your paragraphs%2$s!", tooLongParagraphs.length ),
			urlTitle,
			"</a>",
			tooLongParagraphs.length,
			recommendedValue,
			urlCallToAction
		),
	};
};

/**
 * Sort the paragraphs based on word count.
 *
 * @param {Array} paragraphs The array with paragraphs.
 * @returns {Array} The array sorted on word counts.
 */
var sortParagraphs = function( paragraphs ) {
	return paragraphs.sort(
		function( a, b ) {
			return b.wordCount - a.wordCount;
		}
	);
};

/**
 * Creates a marker for the paragraphs.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {Array} An array with marked paragraphs.
 */
var paragraphLengthMarker = function( paper, researcher ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );
	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	return map( tooLongParagraphs, function( paragraph ) {
		var paragraphText = stripHTMLTags( paragraph.text );
		var marked = marker( paragraphText );
		return new Mark( {
			original: paragraphText,
			marked: marked,
		} );
	} );
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );

	paragraphsLength = sortParagraphs( paragraphsLength );

	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooLongParagraphs, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( paragraphLengthResult.score );
	assessmentResult.setText( paragraphLengthResult.text );
	assessmentResult.setHasMarks( paragraphLengthResult.hasMarks );

	return assessmentResult;
};

export default {
	identifier: "textParagraphTooLong",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: paragraphLengthMarker,
};
