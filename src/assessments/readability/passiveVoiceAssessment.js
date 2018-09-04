import AssessmentResult from '../../values/AssessmentResult.js';
import formatNumber from '../../helpers/formatNumber.js';
import { inRangeEndInclusive as inRange } from '../../helpers/inRange.js';
import { stripIncompleteTags as stripTags } from '../../stringProcessing/stripHTMLTags';
import Mark from '../../values/Mark.js';
import marker from '../../markers/addMark.js';

import { map } from "lodash-es";

import getLanguageAvailability from '../../helpers/getLanguageAvailability.js';
const availableLanguages = [ "en", "de", "fr", "es", "ru", "it", "nl", "pl" ];

/**
 * Calculates the result based on the number of sentences and passives.
 * @param {object} passiveVoice The object containing the number of sentences and passives
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
let calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	let score;
	let percentage = 0;
	let recommendedValue = 10;
	let passiveVoiceURL = "<a href='https://yoa.st/passive-voice' target='_blank'>";
	let hasMarks;

	// Prevent division by zero errors.
	if ( passiveVoice.total !== 0 ) {
		percentage = formatNumber( ( passiveVoice.passives.length / passiveVoice.total ) * 100 );
	}

	hasMarks = ( percentage > 0 );

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
			),
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
		),
	};
};

/**
 * Marks all sentences that have the passive voice.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {object} All marked sentences.
 */
let passiveVoiceMarker = function( paper, researcher ) {
	const passiveVoice = researcher.getResearch( "passiveVoice" );
	return map( passiveVoice.passives, function( sentence ) {
		sentence = stripTags( sentence );
		let marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked,
		} );
	} );
};

/**
 * Runs the passiveVoice module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
let passiveVoiceAssessment = function( paper, researcher, i18n ) {
	const passiveVoice = researcher.getResearch( "passiveVoice" );

	const passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	const assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );
	assessmentResult.setHasMarks( passiveVoiceResult.hasMarks );

	return assessmentResult;
};

export default {
	identifier: "passiveVoice",
	getResult: passiveVoiceAssessment,
	isApplicable: function( paper ) {
		const isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return ( isLanguageAvailable && paper.hasText() );
	},
	getMarks: passiveVoiceMarker,
};
