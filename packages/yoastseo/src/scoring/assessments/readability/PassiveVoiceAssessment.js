import { map, merge } from "lodash-es";

import formatNumber from "../../../helpers/formatNumber";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import marker from "../../../markers/addMark";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { stripIncompleteTags as stripTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";

/**
 * Represents the assessment that checks whether there are passive sentences in the text.
 */
export default class PassiveVoiceAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: "",
			urlCallToAction: "",
		};

		this.identifier = "passiveVoice";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Calculates the result based on the number of sentences and passives.
	 *
	 * @param {object} passiveVoice     The object containing the number of sentences and passives.
	 * @param {object} i18n             The object used for translations.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {{score: number, text}} resultobject with score and text.
	 */
	calculatePassiveVoiceResult( passiveVoice, i18n, researcher ) {
		let urlTitle = this._config.urlTitle;
		let urlCallToAction = this._config.urlCallToAction;
		// Get the links
		const links = researcher.getData( "links" );
		// Check if links for the assessment is available in links data
		if ( links[ "shortlinks.metabox.readability.sentence_length" ] &&
			links[ "shortlinks.metabox.readability.sentence_lengthCall_to_action" ] ) {
			// Overwrite default links with links from configuration
			urlTitle = createAnchorOpeningTag( links[ "shortlinks.metabox.readability.passive_voice" ] );
			urlCallToAction = createAnchorOpeningTag( links[ "shortlinks.metabox.readability.passive_voiceCall_to_action" ] );
		}
		let score;
		let percentage = 0;
		const recommendedValue = 10;

		// Prevent division by zero errors.
		if ( passiveVoice.total !== 0 ) {
			percentage = formatNumber( ( passiveVoice.passives.length / passiveVoice.total ) * 100 );
		}

		const hasMarks = percentage > 0;

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
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sPassive voice%2$s: You're using enough active voice. That's great!" ),
					urlTitle,
					"</a>"
				),
			};
		}
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
				/* Translators: %1$s and %5$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
				%3$s expands to the percentage of sentences in passive voice, %4$s expands to the recommended value. */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sPassive voice%2$s: %3$s of the sentences contain passive voice, which is more than the recommended maximum of %4$s. " +
					"%5$sTry to use their active counterparts%2$s."

				),
				urlTitle,
				"</a>",
				percentage + "%",
				recommendedValue + "%",
				urlCallToAction
			),
		};
	}

	/**
	 * Marks all sentences that have the passive voice.
	 *
	 * @param {object} paper        The paper to use for the assessment.
	 * @param {object} researcher   The researcher used for calling research.
	 *
	 * @returns {object} All marked sentences.
	 */
	getMarks( paper, researcher ) {
		const passiveVoice = researcher.getResearch( "getPassiveVoiceResult" );
		return map( passiveVoice.passives, function( sentence ) {
			sentence = stripTags( sentence );
			const marked = marker( sentence );
			return new Mark( {
				original: sentence,
				marked: marked,
			} );
		} );
	}

	/**
	 * Runs the passiveVoice module, based on this returns an assessment result with score and text.
	 *
	 * @param {object} paper        The paper to use for the assessment.
	 * @param {object} researcher   The researcher used for calling research.
	 * @param {object} i18n         The object used for translations.
	 *
	 * @returns {object} the Assessmentresult
	 */
	getResult( paper, researcher, i18n ) {
		const passiveVoice = researcher.getResearch( "getPassiveVoiceResult" );

		const passiveVoiceResult = this.calculatePassiveVoiceResult( passiveVoice, i18n, researcher );

		const assessmentResult = new AssessmentResult();

		assessmentResult.setScore( passiveVoiceResult.score );
		assessmentResult.setText( passiveVoiceResult.text );
		assessmentResult.setHasMarks( passiveVoiceResult.hasMarks );

		return assessmentResult;
	}

	/**
	 * Checks if passive voice analysis is available for the language of the paper.
	 *
	 * @param {Paper}       paper       The paper to check.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} Returns true if the language is available and the paper is not empty.
	 */
	isApplicable( paper, researcher ) {
		return paper.hasText() && researcher.hasResearch( "getPassiveVoiceResult" );
	}
}
