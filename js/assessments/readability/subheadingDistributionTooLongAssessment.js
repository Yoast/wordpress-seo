let AssessmentResult = require( "../../values/AssessmentResult.js" );
let Assessment = require( "../../assessment.js" );
let isTextTooLong = require( "../../helpers/isValueTooLong" );
let filter = require( "lodash/filter" );
let map = require( "lodash/map" );
let merge = require( "lodash/merge" );

let Mark = require( "../../values/Mark.js" );
let marker = require( "../../markers/addMark.js" );
let inRange = require( "../../helpers/inRange.js" ).inRangeEndInclusive;

let defaultConfig = {
	// The maximum recommended value of the subheading text.
	recommendedValue: 300,
	greenBulletTreshold: 300,
	redBulletTreshhold: 350,
};

/**
 * Represents the assessment for calculating the text after each subheading.
 */
class SubheadingsDistributionTooLong extends Assessment {

	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		this.identifier = "subheadingsTooLong";
		this._config = merge( config, defaultConfig );
	}

	/**
	 * Runs the getSubheadingTextLength research and checks scores based on length.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		let subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
		subheadingTextsLength = subheadingTextsLength.sort(
			function( a, b ) {
				return b.wordCount - a.wordCount;
			}
		);

		let tooLongTexts = this.getTooLongSubheadingTexts( subheadingTextsLength ).length;
		let score = this.calculateScore( subheadingTextsLength );

		let assessmentResult = new AssessmentResult();

		assessmentResult.setScore( score );
		assessmentResult.setText( this.translateScore( score, tooLongTexts, i18n ) );
		assessmentResult.setHasMarks( ( score > 2 && score < 7 ) );

		return assessmentResult;
	}

	/**
	 * Is this assessment applicable?
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Creates a marker for each text following a subheading that is too long.
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {object} researcher The researcher used for calling research.
	 * @returns {Array} All markers for the current text.
	 */
	getMarks( paper, researcher ) {
		let subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
		let tooLongTexts = this.getTooLongSubheadingTexts( subheadingTextsLength );

		return map( tooLongTexts, function( tooLongText ) {
			let marked = marker( tooLongText.text );
			return new Mark( {
				original: tooLongText.text,
				marked: marked,
			} );
		} );
	}

	/**
	 * Counts the number of subheading texts that are too long.
	 *
	 * @param {Array} subheadingTextsLength Array with subheading text lengths.
	 * @returns {number} The number of subheading texts that are too long.
	 */
	getTooLongSubheadingTexts( subheadingTextsLength ) {
		return filter( subheadingTextsLength, function( subheading ) {
			return isTextTooLong( this._config.recommendedValue, subheading.wordCount );
		}.bind( this ) );
	}

	/**
	 * Calculates the score based on the subheading texts length.
	 *
	 * @param {Array} subheadingTextsLength Array with subheading text lengths.
	 * @returns {number} The calculated score.
	 */
	calculateScore( subheadingTextsLength ) {
		let score;

		if ( subheadingTextsLength.length === 0 ) {
			// Red indicator, use '2' so we can differentiate in external analysis.
			return 2;
		}

		let longestSubheadingTextLength = subheadingTextsLength[ 0 ].wordCount;

		// Green indicator.
		if ( longestSubheadingTextLength <= this._config.greenBulletTreshold ) {
			score = 9;
		}

		// Orange indicator.
		if ( inRange( longestSubheadingTextLength, this._config.greenBulletTreshold, this._config.redBulletTreshhold  ) ) {
			score = 6;
		}

		// Red indicator.
		if ( longestSubheadingTextLength > this._config.redBulletTreshhold ) {
			score = 3;
		}

		return score;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} score The score.
	 * @param {number} tooLongTexts The amount of too long texts.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} A string.
	 */
	translateScore( score, tooLongTexts, i18n ) {
		if ( score === 2 ) {
			return i18n.dgettext(
				"js-text-analysis",
				"The text does not contain any subheadings. Add at least one subheading."
			);
		}

		if ( score >= 7 ) {
			return i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					"The amount of words following each of the subheadings doesn't exceed the recommended maximum of %1$d words, which is great."
				), this._config.recommendedValue );
		}


		// Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		return i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				"%1$d subheading is followed by more than the recommended maximum of %2$d words. Try to insert another subheading.",
				"%1$d of the subheadings are followed by more than the recommended maximum of %2$d words. Try to insert additional subheadings.",
				tooLongTexts ),
			tooLongTexts, this._config.recommendedValue
		);
	}
}

module.exports = SubheadingsDistributionTooLong;
