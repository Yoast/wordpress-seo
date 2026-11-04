import { _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * The data a `callbacks.getResultTexts` implementation is given, so a platform can word the feedback for the
 * item it is analyzing without knowing how the assessment reaches its score.
 *
 * @typedef {Object} KeyphraseStuffingInAltTextResultTextsInput
 * @property {string}  urlTitleAnchorOpeningTag  The anchor opening tag for the article about this assessment.
 * @property {string}  urlActionAnchorOpeningTag The anchor opening tag for the call to action.
 * @property {number}  overusedCount             The number of images whose alt text gets the bad score.
 * @property {number}  twiceCount                The number of images whose alt text uses the keyphrase exactly twice,
 *                                               without exact matching.
 * @property {boolean} exactMatchRequested       Whether the keyphrase is in double quotes.
 */

/**
 * The feedback strings for the four states this assessment can report, already formatted with their anchors.
 *
 * Every property is required: the object a callback returns is used as is, so an omitted key renders as an empty
 * result text rather than falling back to the default string.
 *
 * @typedef {Object} KeyphraseStuffingInAltTextResultTexts
 * @property {string} moreThanTwice Only alt texts that use the keyphrase more than twice were found.
 * @property {string} multipleTimes Only alt texts that use the exact-match keyphrase more than once were found.
 * @property {string} twice         Only alt texts that use the keyphrase twice were found.
 * @property {string} twiceOrMore   Alt texts that use the keyphrase twice and more than twice were both found.
 */

/**
 * Represents the assessment that checks whether the alt text of the assessed images overuses the keyphrase or its
 * synonyms: the images in the text, or the Paper's provided images when it supplies them.
 */
export default class KeyphraseStuffingInAltTextAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} [config] The configuration to use.
	 * @param {number} [config.scores.bad] The score to return when an alt text uses the keyphrase more than twice, or
	 *                                     more than once with exact matching.
	 * @param {number} [config.scores.okay] The score to return when an alt text uses the keyphrase twice.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the call-to-action article.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function(KeyphraseStuffingInAltTextResultTextsInput): KeyphraseStuffingInAltTextResultTexts} [config.callbacks.getResultTexts] Returns the feedback strings, replacing the defaults.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				bad: 3,
				okay: 6,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/alt-text-keyphrase-stuffing" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/alt-text-keyphrase-stuffing-cta" ),
			callbacks: {},
		};

		this.identifier = "keyphraseStuffingInAltText";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the Assessment and returns a result.
	 *
	 * An image is overused when its alt text has more than two keyphrase or synonym occurrences, or more than one
	 * when exact matching is requested; it uses the keyphrase twice when it has exactly two without exact matching.
	 *
	 * Returns an empty result — no score and no text — when no image is flagged. Using the keyphrase once is not a
	 * sign of good alt text, so there is nothing to praise: `Assessor.isValidResult` drops a result without a score
	 * and a text, which keeps the assessment out of the list entirely.
	 *
	 * @param {Paper}       paper       The Paper object to assess. Unused: the research reads the images off it.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		const { exactMatchRequested, images } = researcher.getResearch( "altTextKeyphraseCount" );

		this.exactMatchRequested = exactMatchRequested;
		this.overusedCount = 0;
		this.twiceCount = 0;
		const flagged = [];

		images.forEach( ( { identifier, count } ) => {
			if ( count > 2 || ( exactMatchRequested && count > 1 ) ) {
				this.overusedCount++;
			} else if ( count === 2 ) {
				this.twiceCount++;
			} else {
				return;
			}

			if ( identifier !== "" && ! flagged.includes( identifier ) ) {
				flagged.push( identifier );
			}
		} );

		const assessmentResult = new AssessmentResult();

		if ( this.overusedCount === 0 && this.twiceCount === 0 ) {
			return assessmentResult;
		}

		const { moreThanTwice, multipleTimes, twice, twiceOrMore } = this.getFeedbackStrings();

		assessmentResult.setFlaggedItems( flagged );

		if ( this.overusedCount > 0 && this.twiceCount > 0 ) {
			assessmentResult.setScore( this._config.scores.bad );
			assessmentResult.setText( twiceOrMore );
		} else if ( this.overusedCount > 0 ) {
			assessmentResult.setScore( this._config.scores.bad );
			assessmentResult.setText( this.exactMatchRequested ? multipleTimes : moreThanTwice );
		} else {
			assessmentResult.setScore( this._config.scores.okay );
			assessmentResult.setText( twice );
		}

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has a keyphrase, which this assessment needs to look for.
	 *
	 * @param {Paper} paper The paper to check.
	 *
	 * @returns {boolean} Whether the assessment is applicable.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword();
	}

	/**
	 * Returns the feedback strings for the assessment.
	 *
	 * A platform can replace them by passing a `callbacks.getResultTexts` in the config, of the shape
	 * `(KeyphraseStuffingInAltTextResultTextsInput) => KeyphraseStuffingInAltTextResultTexts`. Without that callback
	 * the defaults below apply, so the hook is opt-in and existing consumers are unaffected.
	 *
	 * @returns {KeyphraseStuffingInAltTextResultTexts} The feedback strings.
	 */
	getFeedbackStrings() {
		// Both are already anchor opening tags: the config wraps the URLs before they get here.
		const urlTitleAnchorOpeningTag = this._config.urlTitle;
		const urlActionAnchorOpeningTag = this._config.urlCallToAction;

		if ( this._config.callbacks.getResultTexts ) {
			return this._config.callbacks.getResultTexts( {
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				overusedCount: this.overusedCount,
				twiceCount: this.twiceCount,
				exactMatchRequested: this.exactMatchRequested,
			} );
		}

		const moreThanTwice = sprintf(
			/* translators: %1$s and %4$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			 * %3$d expands to the number of images whose alt text uses the keyphrase or its synonym more than twice. */
			_n(
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images has alt text that uses the keyphrase or its synonym more than twice. %4$sDo not overuse the keyphrase%2$s!",
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images have alt text that uses the keyphrase or its synonym more than twice. %4$sDo not overuse the keyphrase%2$s!",
				this.overusedCount,
				"wordpress-seo"
			),
			urlTitleAnchorOpeningTag,
			"</a>",
			this.overusedCount,
			urlActionAnchorOpeningTag
		);
		const multipleTimes = sprintf(
			/* translators: %1$s and %4$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			 * %3$d expands to the number of images whose alt text uses the keyphrase or its synonym more than once. */
			_n(
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images has alt text that uses the keyphrase or its synonym multiple times. %4$sDo not overuse the keyphrase%2$s!",
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images have alt text that uses the keyphrase or its synonym multiple times. %4$sDo not overuse the keyphrase%2$s!",
				this.overusedCount,
				"wordpress-seo"
			),
			urlTitleAnchorOpeningTag,
			"</a>",
			this.overusedCount,
			urlActionAnchorOpeningTag
		);
		const twice = sprintf(
			/* translators: %1$s and %4$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			 * %3$d expands to the number of images whose alt text uses the keyphrase or its synonym twice. */
			_n(
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images has alt text that uses the keyphrase or its synonym twice. %4$sDo not overuse the keyphrase%2$s!",
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images have alt text that uses the keyphrase or its synonym twice. %4$sDo not overuse the keyphrase%2$s!",
				this.twiceCount,
				"wordpress-seo"
			),
			urlTitleAnchorOpeningTag,
			"</a>",
			this.twiceCount,
			urlActionAnchorOpeningTag
		);
		const twiceOrMore = sprintf(
			/* translators: %1$s and %4$s expand to links on yoast.com, %2$s expands to the anchor end tag,
			 * %3$d expands to the number of images whose alt text uses the keyphrase or its synonym twice or more. */
			_n(
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images has alt text that uses the keyphrase or its synonym twice or more. %4$sDo not overuse the keyphrase%2$s!",
				"%1$sKeyphrase stuffing in alt text%2$s: %3$d of your images have alt text that uses the keyphrase or its synonym twice or more. %4$sDo not overuse the keyphrase%2$s!",
				this.overusedCount + this.twiceCount,
				"wordpress-seo"
			),
			urlTitleAnchorOpeningTag,
			"</a>",
			this.overusedCount + this.twiceCount,
			urlActionAnchorOpeningTag
		);

		return { moreThanTwice, multipleTimes, twice, twiceOrMore };
	}
}
