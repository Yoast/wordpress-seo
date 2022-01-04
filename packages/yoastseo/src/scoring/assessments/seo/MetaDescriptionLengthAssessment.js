import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";
import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import japaneseConfig from "../../../languageProcessing/languages/ja/config/metaDescriptionLength";
/**
 * Assessment for calculating the length of the meta description.
 */
export default class MetaDescriptionLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			recommendedMaximumLength: 120,
			maximumLength: 156,
			scores: {
				noMetaDescription: 1,
				tooLong: 6,
				tooShort: 6,
				correctLength: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34d" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34e" ),
		};

		this.identifier = "metaDescriptionLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Returns the maximum length.
	 *
	 * @param {string}  locale  The locale.
	 *
	 * @returns {number} The maximum length.
	 */
	getMaximumLength( locale ) {
		return this.getConfig( locale ).maximumLength;
	}

	/**
	 * Checks if language specific config is available, and overwrite the default config if it is.
	 *
	 * This method of returning the configuration by checking the locale is necessary since this assessment is also
	 * initialized for calculations outside content analysis where we don't have access to the Researcher.
	 *
	 * @param {string}  locale  The locale.
	 *
	 * @returns {object}    The configuration to use.
	 */
	getConfig( locale ) {
		let config = this._config;
		if ( locale === "ja" ) {
			config = merge( config, japaneseConfig );
		}
		return config;
	}

	/**
	 * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		const descriptionLength = researcher.getResearch( "metaDescriptionLength" );
		const assessmentResult = new AssessmentResult();
		const locale = researcher.getConfig( "language" );
		const config = this.getConfig( locale );

		assessmentResult.setScore( this.calculateScore( descriptionLength, locale ) );
		assessmentResult.setText( this.translateScore( descriptionLength, config ) );

		// Max and actual are used in the snippet editor progress bar.
		assessmentResult.max = config.maximumLength;
		assessmentResult.actual = descriptionLength;

		return assessmentResult;
	}

	/**
	 * Returns the score for the descriptionLength.
	 *
	 * @param {number}  descriptionLength The length of the meta description.
	 * @param {string}  locale            The locale.
	 *
	 * @returns {number} The calculated score.
	 */
	calculateScore( descriptionLength, locale ) {
		const config = this.getConfig( locale );
		if ( descriptionLength === 0 ) {
			return config.scores.noMetaDescription;
		}

		if ( descriptionLength <= this._config.recommendedMaximumLength ) {
			return config.scores.tooShort;
		}

		if ( descriptionLength > this._config.maximumLength ) {
			return config.scores.tooLong;
		}

		return config.scores.correctLength;
	}

	/**
	 * Translates the descriptionLength to a message the user can understand.
	 *
	 * @param {number}  descriptionLength   The length of the meta description.
	 * @param {object}  config              The configuration to use.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( descriptionLength, config ) {
		if ( descriptionLength === 0 ) {
			return sprintf(
				/* Translators:  %1$s and %2$s expand to a links on yoast.com, %3$s expands to the anchor end tag */
				__(
					// eslint-disable-next-line max-len
					"%1$sMeta description length%3$s:  No meta description has been specified. Search engines will display copy from the page instead. %2$sMake sure to write one%3$s!",
					"wordpress-seo"
				),
				config.urlTitle,
				config.urlCallToAction,
				"</a>"
			);
		}

		if ( descriptionLength <= config.recommendedMaximumLength ) {
			return sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
				%4$d expands to the number of characters in the meta description, %5$d expands to
				the total available number of characters in the meta description */
				__(
					// eslint-disable-next-line max-len
					"%1$sMeta description length%3$s: The meta description is too short (under %4$d characters). Up to %5$d characters are available. %2$sUse the space%3$s!",
					"wordpress-seo"
				),
				config.urlTitle,
				config.urlCallToAction,
				"</a>",
				config.recommendedMaximumLength,
				config.maximumLength
			);
		}

		if ( descriptionLength > config.maximumLength ) {
			return sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
				%4$d expands to	the total available number of characters in the meta description */
				__(
					// eslint-disable-next-line max-len
					"%1$sMeta description length%3$s: The meta description is over %4$d characters. To ensure the entire description will be visible, %2$syou should reduce the length%3$s!",
					"wordpress-seo"
				),
				config.urlTitle,
				config.urlCallToAction,
				"</a>",
				config.maximumLength
			);
		}

		return sprintf(
			/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
			__( "%1$sMeta description length%2$s: Well done!", "wordpress-seo" ),
			config.urlTitle,
			"</a>"
		);
	}
}
