import { merge } from "lodash-es";

import Assessment from "../../assessment";
import { inRangeEndInclusive as inRange } from "../../helpers/inRange";
import { createAnchorOpeningTag } from "../../helpers/queryStringAppender";
import AssessmentResult from "../../values/AssessmentResult";

const maximumLength = 600;
/**
 * Represents the assessment that will calculate if the width of the page title is correct.
 */
class PageTitleWidthAssesment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			minLength: 400,
			maxLength: maximumLength,
			scores: {
				noTitle: 1,
				widthTooShort: 6,
				widthTooLong: 3,
				widthCorrect: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34h" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34i" ),
		};

		this.identifier = "titleWidth";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Returns the maximum length.
	 *
	 * @returns {number} The maximum length.
	 */
	getMaximumLength() {
		return maximumLength;
	}

	/**
	 * Runs the pageTitleWidth module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		let pageTitleWidth = researcher.getResearch( "pageTitleWidth" );
		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( this.calculateScore( pageTitleWidth ) );
		assessmentResult.setText( this.translateScore( pageTitleWidth, i18n ) );

		// Max and actual are used in the snippet editor progress bar.
		assessmentResult.max = this._config.maxLength;
		assessmentResult.actual = pageTitleWidth;
		return assessmentResult;
	}

	/**
	 * Returns the score for the pageTitleWidth
	 *
	 * @param {number} pageTitleWidth The width of the pageTitle.
	 *
	 * @returns {number} The calculated score.
	 */
	calculateScore( pageTitleWidth ) {
		if ( inRange( pageTitleWidth, 1, 400 ) ) {
			return this._config.scores.widthTooShort;
		}

		if ( inRange( pageTitleWidth, this._config.minLength, this._config.maxLength ) ) {
			return this._config.scores.widthCorrect;
		}

		if ( pageTitleWidth > this._config.maxLength ) {
			return this._config.scores.widthTooLong;
		}

		return this._config.scores.noTitle;
	}

	/**
	 * Translates the pageTitleWidth score to a message the user can understand.
	 *
	 * @param {number} pageTitleWidth The width of the pageTitle.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( pageTitleWidth, i18n ) {
		if ( inRange( pageTitleWidth, 1, 400 ) ) {
			return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sSEO title width%3$s: The SEO title is too short. " +
					"%2$sUse the space to add keyphrase variations or create compelling call-to-action copy%3$s."
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			);
		}

		if ( inRange( pageTitleWidth, this._config.minLength, this._config.maxLength ) ) {
			return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sSEO title width%2$s: Good job!"
				),
				this._config.urlTitle,
				"</a>"
			);
		}

		if ( pageTitleWidth > this._config.maxLength ) {
			return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sSEO title width%3$s: The SEO title wider than the viewable limit. %2$sTry to make it shorter%3$s."
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			);
		}

		return i18n.sprintf(
			/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis", "%1$sSEO title width%3$s: %2$sPlease create an SEO title%3$s." ),
			this._config.urlTitle,
			this._config.urlCallToAction,
			"</a>"
		);
	}
}

export default PageTitleWidthAssesment;
