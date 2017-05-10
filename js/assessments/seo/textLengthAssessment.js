let AssessmentResult = require( "../../values/AssessmentResult.js" );
let inRange = require( "lodash/inRange" );
let merge = require( "lodash/merge" );

let defaultConfig = {
	recommendedMinimum: 300,
	slightlyBelowMinimum: 250,
	belowMinimum: 200,
	farBelowMinimum: 100,

	scores: {
		recommendedMinimum: 9,
		slightlyBelowMinimum: 7,
		belowMinimum: 5,
		slightlyFarBelowMinimum: -10,
		farBelowMinimum: -20,
	},
};

class TextLengthAssessment {

	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		this.identifier = "textLength";
		this._config = merge( config, defaultConfig );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @param {Researcher} researcher The Researcher object containing all available researches.
	 * @param {object} i18n The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		let wordCount = researcher.getResearch( "wordCountInText" );
		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( this.calculateScore( wordCount ) );
		assessmentResult.setText( i18n.sprintf( this.translateScore( wordCount, i18n ), wordCount, this._config.recommendedMinimum ) );

		return assessmentResult;
	}

	/**
	 * Calculates the score based on the current word count.
	 *
	 * @param {number} wordCount The amount of words to be checked against.

	 * @returns {number|null} The score.
	 */
	calculateScore( wordCount ) {
		if ( wordCount >= this._config.recommendedMinimum ) {
			return this._config.scores.recommendedMinimum;
		}

		if ( inRange( wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			return this._config.scores.slightlyBelowMinimum;
		}

		if ( inRange( wordCount, this._config.belowMinimum, this._config.slightlyBelowMinimum ) ) {
			return this._config.scores.belowMinimum;
		}

		if ( inRange( wordCount, this._config.farBelowMinimum, this._config.belowMinimum ) ) {
			return this._config.scores.slightlyFarBelowMinimum;
		}

		if ( inRange( wordCount, 0, this._config.farBelowMinimum ) ) {
			return this._config.scores.farBelowMinimum;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} wordCount The amount of words to be checked against.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( wordCount, i18n ) {
		if ( wordCount >= this._config.recommendedMinimum ) {
			return i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is more than or equal to the recommended minimum of %2$d word.",
				"This is more than or equal to the recommended minimum of %2$d words.",
				this._config.recommendedMinimum
			);
		}

		if ( inRange( wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum ) ) {
			return i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
				"This is slightly below the recommended minimum of %2$d word. Add a bit more copy.",
				"This is slightly below the recommended minimum of %2$d words. Add a bit more copy.",
				this._config.recommendedMinimum
			);
		}

		if ( inRange( wordCount, this._config.farBelowMinimum, this._config.slightlyBelowMinimum )  ) {
			return i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
				"This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				this._config.recommendedMinimum
			);
		}

		if ( this._config.farBelowMinimum !== 0 && inRange( wordCount, 0, this._config.farBelowMinimum ) ) {
			return i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
				"This is far below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is far below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				this._config.recommendedMinimum
			);
		}

		return "";
	}

}

module.exports = TextLengthAssessment;
