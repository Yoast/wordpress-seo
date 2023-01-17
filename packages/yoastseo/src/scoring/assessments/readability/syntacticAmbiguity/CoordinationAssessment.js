import { __, sprintf } from "@wordpress/i18n";
import Assessment from "../../assessment";
import { createAnchorOpeningTag } from "../../../../helpers/shortlinker";
import AssessmentResult from "../../../../values/AssessmentResult";
import Mark from "../../../../values/Mark";
import { collectMarkingsInSentence } from "../../../../languageProcessing/helpers/word/markWordsInSentences";

/**
 * Represents the assessment that will check whether texts contain syntactically ambiguous coordinations.
 */
export default class CoordinationAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		this.identifier = "coordination";
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher ) {
		this.ambiguousConstructions = researcher.getResearch( "checkCoordination" );

		const calculatedScore = this.calculateResult();

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );
		assessmentResult.setHasMarks( this.ambiguousConstructions.length > 0 );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return this.hasEnoughContentForAssessment( paper );
	}

	/**
	 * Calculate the result based on the availability of lists in the text.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult() {
		// Text with at least one list.
		if ( this.ambiguousConstructions ) {
			return {
				score: 6,
				resultText: sprintf(
					/* Translators: %1$s expands to a link on yoast.com,
                     * %2$s expands to the anchor end tag. */
					__(
						"%1$sCoordination%3$s: Potentially syntactically ambiguous coordination found. " +
						"%2$sPlease consider rephrasing these sentences%3$s.",
						"wordpress-seo"
					),
					createAnchorOpeningTag( "https://yoa.st/shopify38" ),
					createAnchorOpeningTag( "https://yoa.st/shopify38" ),
					"</a>"
				),
			};
		}

		// Text with no lists.
		return {
			score: 9,
			resultText: sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					"%1$sCoordination%2$s: No coordination ambiguity found. Great!",
					"wordpress-seo"
				),
				createAnchorOpeningTag( "https://yoa.st/shopify38" ),
				"</a>"
			),
		};
	}

	/**
	 * Mark the sentences.
	 *
	 * @param {Paper} paper The paper to use for the marking.
	 * @param {Researcher} researcher The researcher to use.
	 *
	 * @returns {Array} Array with all the marked sentences.
	 */
	getMarks( paper, researcher ) {
		this.ambiguousConstructions = researcher.getResearch( "checkCoordination" );
		const matchWordCustomHelper = researcher.getResearch( "matchWordCustomHelper" );

		if ( ! this.ambiguousConstructions ) {
			return [];
		}
		return this.ambiguousConstructions.map( ambiguousConstruction =>
			new Mark( {
				original: ambiguousConstruction.sentence,
				marked: collectMarkingsInSentence( ambiguousConstruction.sentence, ambiguousConstruction.construction, matchWordCustomHelper ),
			} ) );
	}
}
