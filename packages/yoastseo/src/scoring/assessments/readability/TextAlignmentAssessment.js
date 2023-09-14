import { _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";

import Assessment from "../assessment";
import Mark from "../../../values/Mark";
import addMark from "../../../markers/addMark";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";
import { stripBlockTagsAtStartEnd } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";

/**
 * Represents the assessment that checks whether there is an over-use of center-alignment in the text.
 */
export default class TextAlignmentAssessment extends Assessment {
	/**
	 * Constructs a new TextAlignmentAssessment.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/assessment-alignment" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/assessment-alignment-cta" ),
			scores: {
				bad: 2,
			},
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
		const numberOfLongCenterAlignedTexts = longCenterAlignedTexts.length;

		const assessmentResult = new AssessmentResult();
		// We don't want to show the assessment and its feedback when the paper doesn't contain center-aligned text.
		if ( numberOfLongCenterAlignedTexts === 0 ) {
			return assessmentResult;
		}

		const calculatedScore = this.calculateResult( paper, numberOfLongCenterAlignedTexts );

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
	 * @returns {object} Mark objects for all long center-aligned texts.
	 */
	getMarks( paper, researcher ) {
		const longCenterAlignedTexts = researcher.getResearch( "getLongCenterAlignedTexts" );
		// For example: [ {text: "abc", elementType: "heading"}, {text: "123", elementType: "paragraph"} ].
		return longCenterAlignedTexts.map( longCenterAlignedText => {
			const text = longCenterAlignedText.text;
			const fieldsToMark = longCenterAlignedText.elementType;
			/*
			 * Strip the HTML block tags at the beginning and end of the text before applying the yoastmark.
			 * This is because applying yoastmark tags to un-sanitized text could lead to highlighting problem(s).
			 */
			const marked = addMark( stripBlockTagsAtStartEnd( text ) );

			return new Mark( {
				original: text,
				marked: marked,
				fieldsToMark: fieldsToMark,
			} );
		} );
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
		if (  numberOfLongCenterAlignedTexts > 0 ) {
			if ( paper.getWritingDirection() === "RTL" ) {
				return {
					score: this._config.scores.bad,
					resultText: sprintf(
						/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
						%4$s expands to the number of the long center-aligned sections in the text */
						_n(
							"%1$sAlignment%3$s: There is a long section of center-aligned text. %2$sWe recommend making it right-aligned%3$s.",
							"%1$sAlignment%3$s: There are %4$s long sections of center-aligned text. " +
							"%2$sWe recommend making them right-aligned%3$s.",
							numberOfLongCenterAlignedTexts,
							"wordpress-seo-premium"
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>",
						numberOfLongCenterAlignedTexts
					),
				};
			}
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
						%4$s expands to the number of the long center-aligned sections in the text */
					_n(
						"%1$sAlignment%3$s: There is a long section of center-aligned text. %2$sWe recommend making it left-aligned%3$s.",
						"%1$sAlignment%3$s: There are %4$s long sections of center-aligned text. " +
						"%2$sWe recommend making them left-aligned%3$s.",
						numberOfLongCenterAlignedTexts,
						"wordpress-seo-premium"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					numberOfLongCenterAlignedTexts
				),
			};
		}
	}
}
