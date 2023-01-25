import { __, sprintf } from "@wordpress/i18n";
import { map, merge } from "lodash-es";

import formatNumber from "../../../helpers/formatNumber";
import { inRangeStartInclusive as inRange } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { stripIncompleteTags as stripTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark.js";
import marker from "../../../markers/addMark.js";
import Assessment from "../assessment";


/**
 * Represents the assessment that checks whether there are enough transition words in the text.
 */
export default class TransitionWordsAssessment extends Assessment {
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
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34z" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/35a" ),
			applicableIfTextLongerThan: 200,
		};

		this.identifier = "textTransitionWords";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Calculates the actual percentage of transition words in the sentences.
	 *
	 * @param {object} sentences The object containing the total number of sentences and the number of sentences containing
	 * a transition word.
	 *
	 * @returns {number} The percentage of sentences containing a transition word.
	 */
	calculateTransitionWordPercentage( sentences ) {
		if ( sentences.transitionWordSentences === 0 || sentences.totalSentences === 0 ) {
			return 0;
		}

		return formatNumber( ( sentences.transitionWordSentences / sentences.totalSentences ) * 100 );
	}

	/**
	 * Calculates the score for the assessment based on the percentage of sentences containing transition words.
	 *
	 * @param {number} percentage The percentage of sentences containing transition words.
	 *
	 * @returns {number} The score.
	 */
	calculateScoreFromPercentage( percentage ) {
		if ( percentage < 20 ) {
			// Red indicator.
			return 3;
		}

		if ( inRange( percentage, 20, 30 ) ) {
			// Orange indicator.
			return 6;
		}

		// Green indicator.
		return 9;
	}

	/**
	 * Calculates transition word result.
	 *
	 * @param {object} transitionWordSentences  The object containing the total number of sentences and the number of sentences containing
	 *                                          a transition word.
	 *
	 * @returns {object} Object containing score and text.
	 */
	calculateTransitionWordResult( transitionWordSentences ) {
		const percentage = this.calculateTransitionWordPercentage( transitionWordSentences );
		const score = this.calculateScoreFromPercentage( percentage );
		const hasMarks   = ( percentage > 0 );

		if ( score < 7 && percentage === 0 ) {
			return {
				score: formatNumber( score ),
				hasMarks: hasMarks,
				text: sprintf(
					/* Translators: %1$s and %3$s expand to a link to yoast.com, %2$s expands to the anchor end tag */
					__(
						"%1$sTransition words%2$s: None of the sentences contain transition words. %3$sUse some%2$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._config.urlCallToAction ),
			};
		}

		if ( score < 7 ) {
			return {
				score: formatNumber( score ),
				hasMarks: hasMarks,
				text: sprintf(
					/* Translators: %1$s and %4$s expand to a link to yoast.com, %2$s expands to the anchor end tag,
					%3$s expands to the percentage of sentences containing transition words */
					__(
						// eslint-disable-next-line max-len
						"%1$sTransition words%2$s: Only %3$s of the sentences contain transition words, which is not enough. %4$sUse more of them%2$s.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					percentage + "%",
					this._config.urlCallToAction ),
			};
		}

		return {
			score: formatNumber( score ),
			hasMarks: hasMarks,
			text: sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
				__(
					"%1$sTransition words%2$s: Well done!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>" ),
		};
	}

	/**
	 * Scores the percentage of sentences including one or more transition words.
	 *
	 * @param {object} paper        The paper to use for the assessment.
	 * @param {object} researcher   The researcher used for calling research.
	 *
	 * @returns {object} The Assessment result.
	 */
	getResult( paper, researcher ) {
		const transitionWordSentences = researcher.getResearch( "findTransitionWords" );
		const transitionWordResult = this.calculateTransitionWordResult( transitionWordSentences );
		const assessmentResult = new AssessmentResult();

		assessmentResult.setScore( transitionWordResult.score );
		assessmentResult.setText( transitionWordResult.text );
		assessmentResult.setHasMarks( transitionWordResult.hasMarks );

		return assessmentResult;
	}

	/**
	 * Marks text for the transition words assessment.
	 *
	 * @param {Paper}       paper       The paper to use for the marking.
	 * @param {Researcher}  researcher  The researcher containing the necessary research.
	 *
	 * @returns {Array<Mark>} A list of marks that should be applied.
	 */
	getMarks( paper, researcher ) {
		const transitionWordSentences = researcher.getResearch( "findTransitionWords" );

		return map( transitionWordSentences.sentenceResults, function( sentenceResult ) {
			let sentence = sentenceResult.sentence;
			sentence = stripTags( sentence );
			return new Mark( {
				original: sentence,
				marked: marker( sentence ),
			} );
		} );
	}

	/**
	 * Checks if the transition words assessment is applicable to the paper. Language-specific length requirements and methods of counting text length
	 * may apply (e.g. for Japanese, the text should be counted in characters instead of words, which also makes the minimum required length higher).
	 *
	 * @param {Paper}       paper       The paper to check.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} Returns true if the language is available, the paper is not empty and the text is longer than the minimum required length.
	 */
	isApplicable( paper, researcher ) {
		const customCountLength = researcher.getHelper( "customCountLength" );
		const customApplicabilityConfig = researcher.getConfig( "assessmentApplicability" ).transitionWords;
		if ( customApplicabilityConfig ) {
			this._config.applicableIfTextLongerThan = customApplicabilityConfig;
		}
		const textLength = customCountLength ? customCountLength( paper.getText() ) : researcher.getResearch( "wordCountInText" ).count;
		// Do not use hasEnoughContent in this assessment as it is mostly redundant with `textLength >= this._config.applicableIfTextLongerThan`
		return textLength >= this._config.applicableIfTextLongerThan &&
			researcher.hasResearch( "findTransitionWords" );
	}
}
