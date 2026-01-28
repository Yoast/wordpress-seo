import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import formatNumber from "../../../helpers/formatNumber";
import { inRangeStartInclusive as inRange } from "../../helpers/assessments/inRange";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark.js";
import Assessment from "../assessment";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 * @typedef {import("../../../parse/structure/Sentence").default } Sentence
 * @typedef {import("../../../languageProcessing/researches/findTransitionWords").SentenceWithTransitionWords } SentenceWithTransitionWords
 * @typedef {import("../../../languageProcessing/researches/findTransitionWords").TransitionWordsResult } TransitionWordsResult
 */

/**
 * Represents the assessment that checks whether there are enough transition words in the text.
 */
export default class TransitionWordsAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 * @constructor
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34z" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/35a" ),
			transitionWordsNeededIfTextLongerThan: 200,
		};

		this.identifier = "textTransitionWords";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Calculates the actual percentage of transition words in the sentences.
	 *
	 * @param {TransitionWordsResult} transitionWordResult The result object from the transition words research.
	 *
	 * @returns {number} The percentage of sentences containing a transition word.
	 */
	calculateTransitionWordPercentage( transitionWordResult ) {
		const { totalSentences, transitionWordSentences } = transitionWordResult;
		if ( transitionWordSentences === 0 || totalSentences === 0 ) {
			return 0;
		}

		return formatNumber( ( transitionWordSentences / totalSentences ) * 100 );
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
	 * Calculates the transition word result.
	 *
	 * @param {TransitionWordsResult} transitionWordResult The result object from the transition words research.
	 *
	 * @returns {{score: number, hasMarks: boolean, text: string}} Object containing score and text.
	 */
	calculateTransitionWordResult( transitionWordResult ) {
		const percentage = this.calculateTransitionWordPercentage( transitionWordResult );
		const score = this.calculateScoreFromPercentage( percentage );
		const hasMarks = ( percentage > 0 );

		// If the text is shorter than the minimum required length for transition words, we always return a green traffic light.
		if ( transitionWordResult.textLength < this._config.transitionWordsNeededIfTextLongerThan ) {
			if ( percentage > 0 ) {
				return {
					score: formatNumber( 9 ),
					hasMarks: hasMarks,
					text: sprintf(
						/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
						__(
							"%1$sTransition words%2$s: Well done!",
							"wordpress-seo"
						),
						this._config.urlTitle,
						"</a>" ),
				};
			}
			return {
				score: formatNumber( 9 ),
				hasMarks: hasMarks,
				text: sprintf(
					/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sTransition words%2$s: You are not using any transition words, but your text is short enough and probably doesn't need them.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>" ),
			};
		}

		if ( score < 7 && percentage === 0 ) {
			return {
				score: formatNumber( score ),
				hasMarks: hasMarks,
				text: sprintf(
					/* translators: %1$s and %3$s expand to a link to yoast.com, %2$s expands to the anchor end tag */
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
					/* translators: %1$s and %4$s expand to a link to yoast.com, %2$s expands to the anchor end tag,
					%3$s expands to the percentage of sentences containing transition words */
					__(
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
				/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				__(
					"%1$sTransition words%2$s: Well done!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>" ),
		};
	}

	/**
	 * Gets the result for the assessment.
	 *
	 * @param {Paper} paper        The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The Assessment result.
	 */
	getResult( paper, researcher ) {
		const customMinimumRequiredTextLength = researcher.getConfig( "assessmentApplicability" ).transitionWords;
		if ( customMinimumRequiredTextLength ) {
			this._config.transitionWordsNeededIfTextLongerThan = customMinimumRequiredTextLength;
		}
		const transitionWordResult = researcher.getResearch( "findTransitionWords" );

		const calculatedResult = this.calculateTransitionWordResult( transitionWordResult );
		const assessmentResult = new AssessmentResult();

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.text );
		assessmentResult.setHasMarks( calculatedResult.hasMarks );

		return assessmentResult;
	}

	/**
	 * Gets the marks for the assessment.
	 *
	 * @param {Paper}       paper       The paper to use for the marking.
	 * @param {Researcher}  researcher  The researcher containing the necessary research.
	 *
	 * @returns {Mark[]} A list of marks that should be applied.
	 */
	getMarks( paper, researcher ) {
		/** @type {TransitionWordsResult} */
		const transitionWordResult = researcher.getResearch( "findTransitionWords" );
		const sentencesWithTransitionWords = transitionWordResult.sentenceResults;

		return sentencesWithTransitionWords.map( ( { sentence } ) => {
			const startOffset = sentence.getFirstToken()?.sourceCodeRange.startOffset || 0;
			const endOffset = sentence.getLastToken()?.sourceCodeRange.endOffset || 0;

			return new Mark( {
				position: {
					startOffset,
					endOffset,
					startOffsetBlock: startOffset - ( sentence.parentStartOffset || 0 ),
					endOffsetBlock: endOffset - ( sentence.parentStartOffset || 0 ),
					clientId: sentence.parentClientId || "",
					attributeId: sentence.parentAttributeId || "",
					isFirstSection: sentence.isParentFirstSectionOfBlock || false,
				},
			} );
		} );
	}

	/**
	 * Checks if the transition words assessment is applicable to the paper.
	 *
	 * @param {Paper}       paper       The paper to check.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} Returns true if the assessment is available in the researcher of the language.
	 */
	isApplicable( paper, researcher ) {
		return researcher.hasResearch( "findTransitionWords" );
	}
}
