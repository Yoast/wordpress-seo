import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import Mark from "../../../values/Mark";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Represents the assessment that checks whether there is an over-use of center-alignment in the text.
 */
export default class TextAlignmentAssessment extends Assessment {
	/**
	 * Constructs a new TextAlignmentAssessment.
	 *
	 * @param {object} config The configuration to use.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
	 * @param {object} [config.scores] The scores to use for the assessment.
	 * @param {number} [config.scores.bad] The score to return if the text has an over-use of center-alignment.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function} [config.callbacks.getResultTexts] The function that returns the result texts.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: "https://yoa.st/assessment-alignment",
			urlCallToAction: "https://yoa.st/assessment-alignment-cta",
			scores: {
				bad: 2,
			},
			callbacks: {},
		};

		this._config = merge( defaultConfig, config );

		this.identifier = "textAlignment";
	}

	/**
	 * Executes the assessment and returns a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The researcher used in the assessment.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher ) {
		const longCenterAlignedTexts = researcher.getResearch( "getLongCenterAlignedTexts" );
		this.numberOfLongCenterAlignedTexts = longCenterAlignedTexts.length;

		const assessmentResult = new AssessmentResult();
		// We don't want to show the assessment and its feedback when the paper doesn't contain center-aligned text.
		if ( this.numberOfLongCenterAlignedTexts === 0 ) {
			return assessmentResult;
		}

		const calculatedScore = this.calculateResult( paper, this.numberOfLongCenterAlignedTexts );

		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );
		// We always want to highlight the long center-aligned element.
		assessmentResult.setHasMarks( true );

		return assessmentResult;
	}

	/**
	 * Creates the mark objects for all long center-aligned texts.
	 *
	 * @param {Paper}       paper        The paper to use for the assessment.
	 * @param {Researcher}  researcher   The researcher used in the assessment.
	 *
	 * @returns {Mark[]} Mark objects for all long center-aligned texts.
	 */
	getMarks( paper, researcher ) {
		const nodes = researcher.getResearch( "getLongCenterAlignedTexts" );
		return nodes.map( node => new Mark( {
			position: {
				clientId: node.clientId || "",
				startOffset: node.sourceCodeLocation.startOffset,
				endOffset: node.sourceCodeLocation.endOffset,
				startOffsetBlock: 0,
				endOffsetBlock: node.sourceCodeLocation.endOffset - node.sourceCodeLocation.startOffset,
			} } )
		);
	}

	/**
	 * Checks whether the assessment is applicable.
	 * The assessment is applicable when the paper has at least 50 characters (after sanitation)
	 * and when the researcher has `getLongCenterAlignedText` research.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used in the assessment.
	 *
	 * @returns {boolean} True when the paper has at least 50 characters (after sanitation)
	 * and when the researcher has `getLongCenterAlignedText` research.
	 */
	isApplicable( paper, researcher ) {
		return this.hasEnoughContentForAssessment( paper ) && researcher.hasResearch( "getLongCenterAlignedTexts" );
	}

	/**
	 * Calculates the result based on the number of center-aligned text found in the paper.
	 *
	 * @param {Paper}   paper                           The Paper object to assess.
	 * @param {number}  numberOfLongCenterAlignedTexts  The number of paragraphs and/or headings
	 * that are center aligned and longer than 50 characters.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult( paper, numberOfLongCenterAlignedTexts ) {
		const { rightToLeft, leftToRight } = this.getFeedbackStrings();
		if (  numberOfLongCenterAlignedTexts > 0 ) {
			if ( paper.getWritingDirection() === "RTL" ) {
				return {
					score: this._config.scores.bad,
					resultText: rightToLeft,
				};
			}
			return {
				score: this._config.scores.bad,
				resultText: leftToRight,
			};
		}
	}

	/**
	 * Returns the feedback strings for the assessment.
	 * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
	 * This callback function should return an object with the following properties:
	 * - rightToLeft: string
	 * - leftToRight: string
	 * The singular strings are used when there is only one long center-aligned text, the plural strings are used when there are multiple.
	 * rightToLeft is for the feedback string that is shown when the writing direction is right-to-left.
	 * leftToRight is for the feedback string that is shown when the writing direction is left-to-right.
	 *
	 * @returns {{leftToRight: string, rightToLeft: string}} The feedback strings.
	 */
	getFeedbackStrings() {
		// `urlTitleAnchorOpeningTag` represents the anchor opening tag with the URL to the article about this assessment.
		const urlTitleAnchorOpeningTag = createAnchorOpeningTag( this._config.urlTitle );
		// `urlActionAnchorOpeningTag` represents the anchor opening tag with the URL for the call to action.
		const urlActionAnchorOpeningTag = createAnchorOpeningTag( this._config.urlCallToAction );

		if ( ! this._config.callbacks.getResultTexts ) {
			const defaultResultTexts = {
				rightToLeft: "%1$sAlignment%3$s: There are long sections of center-aligned text. %2$sWe recommend making them right-aligned%3$s.",
				leftToRight: "%1$sAlignment%3$s: There are long sections of center-aligned text. %2$sWe recommend making them left-aligned%3$s.",
			};
			if ( this.numberOfLongCenterAlignedTexts === 1 ) {
				defaultResultTexts.rightToLeft = "%1$sAlignment%3$s: There is a long section of center-aligned text. %2$sWe recommend making it right-aligned%3$s.";
				defaultResultTexts.leftToRight = "%1$sAlignment%3$s: There is a long section of center-aligned text. %2$sWe recommend making it left-aligned%3$s.";
			}
			return mapValues(
				defaultResultTexts,
				( resultText ) => this.formatResultText( resultText, urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag )
			);
		}

		return this._config.callbacks.getResultTexts( {
			urlTitleAnchorOpeningTag,
			urlActionAnchorOpeningTag,
			numberOfLongCenterAlignedTexts: this.numberOfLongCenterAlignedTexts,
		} );
	}
}
