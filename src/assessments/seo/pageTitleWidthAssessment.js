import { merge } from "lodash-es";

import AssessmentResult from "../../values/AssessmentResult.js";
import Assessment from "../../assessment.js";
import { inRangeEndInclusive as inRange } from "../../helpers/inRange";

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
		const url = "<a href='https://yoa.st/2po' target='_blank'>";
		if ( inRange( pageTitleWidth, 1, 400 ) ) {
			return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"The %1$sSEO title%2$s is too short. Use the space to add keyword variations or create compelling call-to-action copy."
				), url, "</a>" );
		}

		if ( inRange( pageTitleWidth, this._config.minLength, this._config.maxLength ) ) {
			return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"The %1$sSEO title%2$s has a nice length."
				), url, "</a>" );
		}

		if ( pageTitleWidth > this._config.maxLength ) {
			return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"The %1$sSEO title%2$s is wider than the viewable limit."
				),  url, "</a>" );
		}

		return i18n.sprintf(
			/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis", "Please create an %1$sSEO title%2$s." ),
			url, "</a>"
		);
	}
}

export default PageTitleWidthAssesment;
