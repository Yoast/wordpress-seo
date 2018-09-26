import AssessmentResult from "../../values/AssessmentResult.js";
import formatNumber from "../../helpers/formatNumber.js";
import { map } from "lodash-es";
import { inRangeStartInclusive as inRange } from "../../helpers/inRange.js";
import { stripIncompleteTags as stripTags } from "../../stringProcessing/stripHTMLTags";
import Mark from "../../values/Mark.js";
import marker from "../../markers/addMark.js";
import getLanguageAvailability from "../../helpers/getLanguageAvailability.js";
let availableLanguages = [ "en", "de", "es", "fr", "nl", "it", "pt", "ru", "ca", "pl" ];

/**
 * Calculates the actual percentage of transition words in the sentences.
 *
 * @param {object} sentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @returns {number} The percentage of sentences containing a transition word.
 */
let calculateTransitionWordPercentage = function( sentences ) {
	if ( sentences.transitionWordSentences === 0 || sentences.totalSentences === 0 ) {
		return 0;
	}

	return formatNumber( ( sentences.transitionWordSentences / sentences.totalSentences ) * 100 );
};

/**
 * Calculates transition word result
 * @param {object} transitionWordSentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
let calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	let score;
	let percentage = calculateTransitionWordPercentage( transitionWordSentences );
	let hasMarks   = ( percentage > 0 );
	let urlTitle = "<a href='https://yoa.st/34z' target='_blank'>";
	let urlCallToAction = "<a href='https://yoa.st/35a' target='_blank'>";

	if ( percentage < 20 ) {
		// Red indicator.
		score = 3;
	}

	if ( inRange( percentage, 20, 30 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage >= 30 ) {
		// Green indicator.
		score = 9;
	}

	if ( score < 7 ) {
		return {
			score: formatNumber( score ),
			hasMarks: hasMarks,
			text: i18n.sprintf(
				/* Translators: %1$s and %4$s expand to a link to yoast.com, %2$s expands to the anchor end tag,
				%3$s expands to the percentage of sentences containing transition words, %4$s expands to the recommended value. */
				i18n.dgettext( "js-text-analysis",
					"%1$sTransition words%2$s: Only %3$s of the sentences contain them, this is not enough. %4$sUse more transition words%2$s."
				),
				urlTitle,
				"</a>",
				percentage + "%",
				urlCallToAction ),
		};
	}

	return {
		score: formatNumber( score ),
		hasMarks: hasMarks,
		text: i18n.sprintf(
			/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
			i18n.dgettext( "js-text-analysis",
				"%1$sTransition words%2$s: Well done!"
			),
			urlTitle,
			"</a>" ),
	};
};

/**
 * Scores the percentage of sentences including one or more transition words.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result.
 */
let transitionWordsAssessment = function( paper, researcher, i18n ) {
	let transitionWordSentences = researcher.getResearch( "findTransitionWords" );
	let transitionWordResult = calculateTransitionWordResult( transitionWordSentences, i18n );
	let assessmentResult = new AssessmentResult();

	assessmentResult.setScore( transitionWordResult.score );
	assessmentResult.setText( transitionWordResult.text );
	assessmentResult.setHasMarks( transitionWordResult.hasMarks );

	return assessmentResult;
};

/**
 * Marks text for the transition words assessment.
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher containing the necessary research.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
let transitionWordsMarker = function( paper, researcher ) {
	let transitionWordSentences = researcher.getResearch( "findTransitionWords" );

	return map( transitionWordSentences.sentenceResults, function( sentenceResult ) {
		let sentence = sentenceResult.sentence;
		sentence = stripTags( sentence );
		return new Mark( {
			original: sentence,
			marked: marker( sentence ),
		} );
	} );
};

export default {
	identifier: "textTransitionWords",
	getResult: transitionWordsAssessment,
	isApplicable: function( paper ) {
		let isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return ( isLanguageAvailable && paper.hasText() );
	},
	getMarks: transitionWordsMarker,
};
