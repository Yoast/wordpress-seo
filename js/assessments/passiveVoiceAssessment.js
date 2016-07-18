var AssessmentResult = require( "../values/AssessmentResult.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var map = require( "lodash/map" );

/**
 * Calculates the result based on the number of sentences and passives.
 * @param {object} passiveVoice The object containing the number of sentences and passives
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	var score;

	var percentage = ( passiveVoice.passives.length / passiveVoice.total ) * 100;
	percentage = formatNumber( percentage );
	var recommendedValue = 10;
	var passiveVoiceURL = "<a href='https://yoa.st/passive-voice' target='_blank'>";
	var hasMarks = ( percentage > 0 );

	if ( percentage <= 10 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( percentage, 10, 15 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage > 15 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
					i18n.dgettext(
						"js-text-analysis",

						// Translators: %1$s expands to the number of sentences in passive voice, %2$s expands to a link on yoast.com,
						// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
						"%1$s of the sentences contain %2$spassive voice%3$s, " +
						"which is less than or equal to the recommended maximum of %4$s." ),
					percentage + "%",
					passiveVoiceURL,
					"</a>",
					recommendedValue + "%"
			)
		};
	}
	return {
		score: score,
		hasMarks: hasMarks,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",

				// Translators: %1$s expands to the number of sentences in passive voice, %2$s expands to a link on yoast.com,
				// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
				"%1$s of the sentences contain %2$spassive voice%3$s, " +
				"which is more than the recommended maximum of %4$s. Try to use their active counterparts."
			),
			percentage + "%",
			passiveVoiceURL,
			"</a>",
			recommendedValue + "%"
		)
	};
};

/**
 * Marks all sentences that have the passive voice.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {object} All marked sentences.
 */
var passiveVoiceMarker = function( paper, researcher ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );
	return map( passiveVoice.passives, function( sentence ) {
		sentence = stripTags( sentence );
		var marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked
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
	var passiveVoice = researcher.getResearch( "passiveVoice" );

	var passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );
	assessmentResult.setHasMarks( passiveVoiceResult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "passiveVoice",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return ( paper.getLocale().indexOf( "en_" ) > -1 && paper.hasText() );
	},
	getMarks: passiveVoiceMarker
};
