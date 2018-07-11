let Assessment = require( "../../assessment.js" );
let AssessmentResult = require( "../../values/AssessmentResult.js" );
const merge = require( "lodash/merge" );
const isUndefined = require( "lodash/isUndefined" );

/**
 * Assessment to check whether the keyphrase has a good length.
 */
class KeyphraseLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
				acceptableMaximum: 10,
			},
			scores: {
				veryBad: -999,
				consideration: 0,
			},
			urlNoOrGoodKeyword: "<a href='https://yoa.st/2pdd' target='_blank'>",
			urlKeyphraseTooLong: "<a href='https://yoa.st/2pd' target='_blank'>",
		};

		this.identifier = "keyphraseLength";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses the keyphrase presence and length.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	getResult( paper, researcher, i18n ) {
		this._keyphraseLength = researcher.getResearch( "keyphraseLength" );
		let assessmentResult =  new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );

		if ( ! isUndefined( calculatedResult ) ) {
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( calculatedResult.resultText );
		}

		return assessmentResult;
	}

	/**
	 * Calculates the result based on the keyphraseLength research.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} Object with score and text.
	 */
	calculateResult( i18n ) {
		if ( this._keyphraseLength < this._config.parameters.recommendedMinimum ) {
			return {
				score: this._config.scores.veryBad,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"No %1$sfocus keyword%2$s was set for this page. If you do not set a focus keyword, no score can be calculated."
					),
					this._config.urlNoOrGoodKeyword,
					"</a>"
				),
			};
		}


		if ( this._keyphraseLength > this._config.parameters.acceptableMaximum ) {
			return {
				score: this._config.scores.consideration,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"The %1$skeyphrase%2$s is over 10 words, a keyphrase should be shorter."
					),
					this._config.urlKeyphraseTooLong,
					"</a>"
				),
			};
		}
	}
}

module.exports = KeyphraseLengthAssessment;
