import { __, sprintf } from "@wordpress/i18n";
import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import { merge } from "lodash-es";

/**
 * Represents the assessment that will look if the text has a list (only applicable for product pages).
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
			urlTitle: createAnchorOpeningTag(),
			urlCallToAction: createAnchorOpeningTag(),
			scores: {
				bad: 2,
			},
		};

		this._config = merge( defaultConfig, config );

		this.identifier = "textAlignment";
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
		this.textContainsCenterAlignedText =  researcher.getResearch( "getLongCenterAlignedText" );

		const calculatedScore = this.calculateResult( paper, researcher, this.textContainsCenterAlignedText );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

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
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 * @param textContainsCenterAlignedText  The array containing each paragraph or heading with center aligned text that’s longer than 50 characters.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult( paper, researcher, textContainsCenterAlignedText ) {
		// Text in an RTL language with one block of center-aligned text.
		if ( paper.isRTL() ) {
			if ( textContainsCenterAlignedText.length === 1 ) {
				return {
					score: this._config.scores.bad,
					resultText: sprintf(
						/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						__(
							"%1$sAlignment%2$s: Your text contains multiple long blocks of center-aligned text. We recommend changing that " +
							"to right-aligned.",
							"wordpress-seo"
						),
						this._config.urlTitle,
						"</a>"
					),
				};
			}
			// Text in an RTL language with multiple blocks of center-aligned text.
			if ( textContainsCenterAlignedText.length > 1 ) {
				return {
					score: this._config.scores.bad,
					resultText: sprintf(
						/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						__(
							"%1$sAlignment%2$s: Your text has a long block of center-aligned text. We recommend changing that to right-aligned.",
							"wordpress-seo"
						),
						this._config.urlTitle,
						"</a>"
					),
				};
			}
		}
		// Text with one block of center-aligned text in a LTR language.
		if ( textContainsCenterAlignedText.length === 1 ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sAlignment%2$s: Your text contains multiple long blocks of center-aligned text. We recommend changing that " +
						"to left-aligned.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		// Text with multiple blocks of center-aligned text in an LTR language.
		if ( textContainsCenterAlignedText.length > 1  ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sAlignment%2$s: Your text has a long block of center-aligned text. We recommend changing that to left-aligned.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
	}
}
