const merge = require( "lodash/merge" );

const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );

/**
 * Represents the assessment that will look if the images have alt-tags and checks if the keyword is present in one of them.
 */
class TextImagesAssessment extends Assessment {
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
			scores: {
				noImages: 3,
				withAltKeyword: 9,
				withAltNonKeyword: 6,
				withAlt: 6,
				noAlt: 6,
			},
			url: "<a href='https://yoa.st/2pj' target='_blank'>",
		};

		this.identifier = "textImages";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @param {Researcher} researcher The Researcher object containing all available researches.
	 * @param {Jed} i18n The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		const assessmentResult = new AssessmentResult();
		const imageCount = researcher.getResearch( "imageCount" );
		const altProperties = researcher.getResearch( "altTagCount" );

		const calculatedScore = this.calculateResult( imageCount, altProperties, i18n );

		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Calculate the score and the feedback string based on the current image count and current image alt-tag count.
	 *
	 * @param {number} imageCount The amount of images to be checked against.
	 * @param {Object} altProperties An object containing the various alt-tags.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The calculated score and the feedback string.
	 */
	calculateResult( imageCount, altProperties, i18n ) {

		if ( imageCount === 0 ) {
			return {
				score: this._config.scores.noImages,
				resultText: i18n.sprintf(
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "No %1$simages%2$s appear in this page, consider adding some as appropriate." ),
					this._config.url,
					"</a>"
				),
			};
		}

		// Has alt-tag and keywords
		if ( altProperties.withAltKeyword > 0 ) {
			return {
				score: this._config.scores.withAltKeyword,
				resultText: i18n.sprintf(
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "The %1$simages%2$s on this page contain alt attributes with the topic words." ),
					this._config.url,
					"</a>"
				),
			};
		}

		// Has alt-tag, but no keywords and it's not okay
		if ( altProperties.withAltNonKeyword > 0 ) {
			return {
				score: this._config.scores.withAltNonKeyword,
				resultText: i18n.sprintf(
					i18n.dgettext( "js-text-analysis", "The %1$simages%2$s on this page do not have alt attributes with the topic words." ),
					this._config.url,
					"</a>"
				),
			};
		}

		// Has alt-tag, but no keyword is set
		if ( altProperties.withAlt > 0 ) {
			return {
				score: this._config.scores.withAlt,
				resultText: i18n.sprintf(
					i18n.dgettext( "js-text-analysis", "The %1$simages%2$s on this page contain alt attributes." ),
					this._config.url,
					"</a>"
				),
			};
		}

		// Has no alt-tag
		if ( altProperties.noAlt > 0 ) {
			return {
				score: this._config.scores.noAlt,
				resultText: i18n.sprintf(
					i18n.dgettext( "js-text-analysis", "The %1$simages%2$s on this page are missing alt attributes." ),
					this._config.url,
					"</a>"
				),
			};
		}
		return null;
	}
}

module.exports = TextImagesAssessment;
