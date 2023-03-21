import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";
import { Assessment, AssessmentResult, helpers, languageProcessing, values, markers } from "yoastseo";
const { createAnchorOpeningTag } = helpers;
const { stripHTMLTags } = languageProcessing;
const { Mark } = values;
const { addMark } = markers;

/**
 * Represents the assessment that checks whether there is an over-use of center-alignment in the text.
 */
export default class TextAlignmentAssessment extends Assessment {
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
		// For example: [ {text: "abc", typeOfBlock: "heading"}, {text: "123", typeOfBlock: "paragraph"} ].
		return longCenterAlignedTexts.map( longCenterAlignedText => {
			const text = longCenterAlignedText.text;
			const fieldsToMark = longCenterAlignedText.typeOfBlock;
			/*
			 * Strip the HTML tags before applying the yoastmark.
			 * This is because applying yoastmark tags to unsanitized text could lead to highlighting problem(s).
			 */
			const marked = addMark( stripHTMLTags( text ) );

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
	 * @param {Researcher}  researcher   The researcher used in the assessment.
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
	 * @param {Paper}       paper                   The Paper object to assess.
	 * @param {number}      numberOfLongCenterAlignedTexts  The number of paragraphs and/or headings
	 * that are center aligned and longer than 50 characters.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult( paper, numberOfLongCenterAlignedTexts ) {
		/*
		 * When the paper's writing direction is right to left (RTL), the suggested alignment in the case of center-aligned text is "right-aligned".
		 * Otherwise, the suggestion would be "left-aligned".
		 */
		const preferredAlignment = paper.getWritingDirection() === "RTL"
			? __( "right-aligned", "wordpress-seo" )
			: __( "left-aligned", "wordpress-seo" );

		if (  numberOfLongCenterAlignedTexts > 0 ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
					%4$s expands to "right-aligned" when the string is shown in a language written from right to left
					and expands to "left-aligned" when the string is shown in a language written from left to right */
					_n(
						"%1$sAlignment%3$s: Your text has a long block of center-aligned text. %2$sWe recommend changing that to %4$s%3$s.",
						"%1$sAlignment%3$s: Your text contains multiple long blocks of center-aligned text. " +
						"%2$sWe recommend changing that to %4$s%3$s.",
						numberOfLongCenterAlignedTexts,
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					preferredAlignment
				),
			};
		}
	}
}
