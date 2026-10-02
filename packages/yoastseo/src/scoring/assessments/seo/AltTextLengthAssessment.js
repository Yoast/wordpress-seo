import { _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";
import { TOO_LONG_BOUNDARY, TOO_SHORT_BOUNDARY } from "../../../languageProcessing/researches/altTextLength";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * The data a `callbacks.getResultTexts` implementation is given, so a platform can word the feedback for the
 * item it is analyzing without knowing how the assessment reaches its score.
 *
 * @typedef {Object} AltTextLengthResultTextsInput
 * @property {string} urlTitleAnchorOpeningTag The anchor opening tag for the article about this assessment.
 * @property {string} urlActionAnchorOpeningTag The anchor opening tag for the call to action.
 * @property {number} tooShortCount The number of assessed images whose alt text is too short.
 * @property {number} tooLongCount The number of assessed images whose alt text is too long.
 * @property {number} tooShortBoundary The number of characters up to which alt text counts as too short.
 * @property {number} tooLongBoundary The number of characters from which alt text counts as too long.
 */

/**
 * The feedback strings for the three states this assessment can report, already formatted with their anchors.
 *
 * Every property is required: the object a callback returns is used as is, so an omitted key renders as an empty
 * result text rather than falling back to the default string.
 *
 * @typedef {Object} AltTextLengthResultTexts
 * @property {string} tooShort Only too short alt texts were found.
 * @property {string} tooLong Only too long alt texts were found.
 * @property {string} both Both too short and too long alt texts were found.
 */

/**
 * Represents the assessment that checks whether the assessed images have alt text that is likely too short or
 * too long: the images in the text, or the Paper's provided images when it supplies them.
 */
export default class AltTextLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} [config] The configuration to use.
	 * @param {number} [config.scores.okay] The score to return when alt text is too short, too long, or both.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the call-to-action article.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function(AltTextLengthResultTextsInput): AltTextLengthResultTexts} [config.callbacks.getResultTexts] Returns the feedback strings, replacing the defaults.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				okay: 6,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/alt-text-length" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/alt-text-length-cta" ),
			callbacks: {},
		};

		this.identifier = "altTextLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the Assessment and returns a result.
	 *
	 * Returns an empty result — no score and no text — when no assessed image has alt text that is too short or
	 * too long. There is no good range for alt text length, so there is nothing to praise: `Assessor.isValidResult`
	 * drops a result without a score and a text, which keeps the assessment out of the list entirely.
	 *
	 * @param {Paper}       paper       The Paper object to assess. Unused: the research reads the images off it.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		const { tooShort, tooLong } = researcher.getResearch( "altTextLength" );

		this.tooShortCount = tooShort;
		this.tooLongCount = tooLong;

		const assessmentResult = new AssessmentResult();

		if ( this.tooShortCount === 0 && this.tooLongCount === 0 ) {
			return assessmentResult;
		}

		const { tooShort: tooShortResultText, tooLong: tooLongResultText, both } = this.getFeedbackStrings();

		assessmentResult.setScore( this._config.scores.okay );

		if ( this.tooShortCount > 0 && this.tooLongCount > 0 ) {
			assessmentResult.setText( both );
		} else if ( this.tooShortCount > 0 ) {
			assessmentResult.setText( tooShortResultText );
		} else {
			assessmentResult.setText( tooLongResultText );
		}

		return assessmentResult;
	}

	/**
	 * Returns the feedback strings for the assessment.
	 *
	 * A platform can replace them by passing a `callbacks.getResultTexts` in the config, of the shape
	 * `(AltTextLengthResultTextsInput) => AltTextLengthResultTexts`. Without that callback the defaults below
	 * apply, so the hook is opt-in and existing consumers are unaffected.
	 *
	 * @returns {AltTextLengthResultTexts} The feedback strings.
	 */
	getFeedbackStrings() {
		// Both are already anchor opening tags: the config wraps the URLs before they get here.
		const urlTitleAnchorOpeningTag = this._config.urlTitle;
		const urlActionAnchorOpeningTag = this._config.urlCallToAction;

		if ( this._config.callbacks.getResultTexts ) {
			return this._config.callbacks.getResultTexts( {
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				tooShortCount: this.tooShortCount,
				tooLongCount: this.tooLongCount,
				// Handed over so a platform's own strings name the same limits without repeating the numbers.
				tooShortBoundary: TOO_SHORT_BOUNDARY,
				tooLongBoundary: TOO_LONG_BOUNDARY,
			} );
		}

		return {
			tooShort: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
				 * %4$d expands to the number of images whose alt text is too short,
				 * %5$d expands to the maximum number of characters that counts as too short. */
				_n(
					"%1$sAlt text length%3$s: %4$d of your images has alt text of %5$d characters or fewer. %2$sConsider making it more descriptive%3$s.",
					"%1$sAlt text length%3$s: %4$d of your images have alt text of %5$d characters or fewer. %2$sConsider making it more descriptive%3$s.",
					this.tooShortCount,
					"wordpress-seo"
				),
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				"</a>",
				this.tooShortCount,
				TOO_SHORT_BOUNDARY
			),
			tooLong: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
				 * %4$d expands to the number of images whose alt text is too long,
				 * %5$d expands to the number of characters from which alt text counts as too long. */
				_n(
					"%1$sAlt text length%3$s: %4$d of your images has alt text of %5$d characters or more. %2$sConsider making it more concise%3$s.",
					"%1$sAlt text length%3$s: %4$d of your images have alt text of %5$d characters or more. %2$sConsider making it more concise%3$s.",
					this.tooLongCount,
					"wordpress-seo"
				),
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				"</a>",
				this.tooLongCount,
				TOO_LONG_BOUNDARY
			),
			both: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
				 * %4$d expands to the number of images whose alt text is too long or too short,
				 * %5$d expands to the maximum number of characters that counts as too short,
				 * %6$d expands to the number of characters from which alt text counts as too long. */
				_n(
					"%1$sAlt text length%3$s: %4$d of your images has alt text that is either too short (%5$d characters or fewer) or too long (%6$d characters or more). %2$sConsider revising them%3$s.",
					"%1$sAlt text length%3$s: %4$d of your images have alt text that is either too short (%5$d characters or fewer) or too long (%6$d characters or more). %2$sConsider revising them%3$s.",
					this.tooLongCount + this.tooShortCount,
					"wordpress-seo"
				),
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				"</a>",
				this.tooLongCount + this.tooShortCount,
				TOO_SHORT_BOUNDARY,
				TOO_LONG_BOUNDARY
			),
		};
	}
}
