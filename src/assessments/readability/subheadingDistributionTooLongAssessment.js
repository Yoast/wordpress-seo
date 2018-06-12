const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );
const isTextTooLong = require( "../../helpers/isValueTooLong" );
const getSubheadings = require( "../../stringProcessing/getSubheadings.js" ).getSubheadings;
const getWords = require( "../../stringProcessing/getWords.js" );
const filter = require( "lodash/filter" );
const map = require( "lodash/map" );
const merge = require( "lodash/merge" );

const Mark = require( "../../values/Mark.js" );
const marker = require( "../../markers/addMark.js" );
const inRange = require( "../../helpers/inRange.js" ).inRangeEndInclusive;

/**
 * Represents the assessment for calculating the text after each subheading.
 */
class SubheadingsDistributionTooLong extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			parameters: {
				// The maximum recommended value of the subheading text.
				recommendedMaximumWordCount: 300,
				slightlyTooMany: 300,
				farTooMany: 350,
			},
			url: "<a href='https://yoa.st/headings' target='_blank'>",
			scores: {
				goodShortTextNoSubheadings: 9,
				goodSubheadings: 9,
				okSubheadings: 6,
				badSubheadings: 3,
				badLongTextNoSubheadings: 2,
			},
		};

		this.identifier = "subheadingsTooLong";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getSubheadingTextLength research and checks scores based on length.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );

		this._subheadingTextsLength = this._subheadingTextsLength.sort( function( a, b ) {
			return b.wordCount - a.wordCount;
		} );

		this._tooLongTexts = this.getTooLongSubheadingTexts();
		this._tooLongTextsNumber = this.getTooLongSubheadingTexts().length;

		let assessmentResult = new AssessmentResult();
		assessmentResult.setIdentifier( this.identifier );

		this._hasSubheadings = this.hasSubheadings( paper );

		this._textLength = getWords( paper.getText() ).length;

		const calculatedResult = this.calculateResult( i18n );
		calculatedResult.resultTextPlural = calculatedResult.resultTextPlural || "";
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		if ( calculatedResult.score > 2 && calculatedResult.score < 7 ) {
			assessmentResult.setHasMarks( true );
			assessmentResult.setMarker( this.getMarks() );
		}

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
	 * Checks whether the paper has subheadings.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is at least one subheading.
	 */
	hasSubheadings( paper ) {
		const subheadings = getSubheadings( paper.getText() );
		return subheadings.length > 0;
	}

	/**
	 * Creates a marker for each text following a subheading that is too long.
	 * @returns {Array} All markers for the current text.
	 */
	getMarks() {
		return map( this._tooLongTexts, function( tooLongText ) {
			const marked = marker( tooLongText.text );
			return new Mark( {
				original: tooLongText.text,
				marked: marked,
			} );
		} );
	}

	/**
	 * Counts the number of subheading texts that are too long.
	 *
	 * @returns {number} The number of subheading texts that are too long.
	 */
	getTooLongSubheadingTexts() {
		return filter( this._subheadingTextsLength, function( subheading ) {
			return isTextTooLong( this._config.parameters.recommendedMaximumWordCount, subheading.wordCount );
		}.bind( this ) );
	}

	/**
	 * Calculates the score and creates a feedback string based on the subheading texts length.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult( i18n ) {
		if ( this._textLength > 300 ) {
			if ( this._hasSubheadings ) {
				const longestSubheadingTextLength = this._subheadingTextsLength[ 0 ].wordCount;
				if ( longestSubheadingTextLength <= this._config.parameters.slightlyTooMany ) {
					// Green indicator.
					return {
						score: this._config.scores.goodSubheadings,
						resultText: i18n.sprintf(
							// Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
							i18n.dgettext(
								"js-text-analysis",
								"Great job with using %1$ssubheadings%2$s!"
							),
							this._config.url,
							"</a>"
						),
					};
				}

				if ( inRange( longestSubheadingTextLength, this._config.parameters.slightlyTooMany, this._config.parameters.farTooMany ) ) {
					// Orange indicator.
					return {
						score: this._config.scores.okSubheadings,
						resultText: i18n.sprintf(
							/*
							 * Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended number
							 * of words following a subheading, %3$s expands to a link to https://yoa.st/headings,
							 * %4$s expands to the link closing tag.
							 */
							i18n.dngettext(
								"js-text-analysis",
								"%1$d section of your text is longer than %2$d words and is not separated by any subheadings. " +
								"Add %3$ssubheadings%4$s to improve readability.",
								"%1$d sections of your text are longer than %2$d words and are not separated by any subheadings. " +
								"Add %3$ssubheadings%4$s to improve readability.",
								this._tooLongTextsNumber ),
							this._tooLongTextsNumber,
							this._config.parameters.recommendedMaximumWordCount,
							this._config.url,
							"</a>"
						),
					};
				}

				// Red indicator.
				return {
					score: this._config.scores.badSubheadings,
					resultText: i18n.sprintf(
						/*
						 * Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended number
						 * of words following a subheading, %3$s expands to a link to https://yoa.st/headings,
						 * %4$s expands to the link closing tag.
						 */
						i18n.dngettext(
							"js-text-analysis",
							"%1$d section of your text is longer than %2$d words and is not separated by any subheadings. " +
							"Add %3$ssubheadings%4$s to improve readability.",
							"%1$d sections of your text are longer than %2$d words and are not separated by any subheadings. " +
							"Add %3$ssubheadings%4$s to improve readability.",
							this._tooLongTextsNumber ),
						this._tooLongTextsNumber,
						this._config.parameters.recommendedMaximumWordCount,
						this._config.url,
						"</a>"
					),
				};
			}
			// Red indicator, use '2' so we can differentiate in external analysis.
			return {
				score: this._config.scores.badLongTextNoSubheadings,
				resultText: i18n.sprintf(
					// Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
					i18n.dgettext(
						"js-text-analysis",
						"You are not using any subheadings, although your text is rather long. " +
						"Try and add  some %1$ssubheadings%2$s."
					),
					this._config.url,
					"</a>"
				),
			};
		}
		if ( this._hasSubheadings ) {
			// Green indicator.
			return {
				score: this._config.scores.goodSubheadings,
				resultText: i18n.sprintf(
					// Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
					i18n.dgettext(
						"js-text-analysis",
						"Great job with using %1$ssubheadings%2$s!"
					),
					this._config.url,
					"</a>"
				),
			};
		}
		// Green indicator.
		return {
			score: this._config.scores.goodShortTextNoSubheadings,
			resultText: i18n.sprintf(
				// Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
				i18n.dgettext(
					"js-text-analysis",
					"You are not using any %1$ssubheadings%2$s, but your text is short enough and probably doesn't need them."
				),
				this._config.url,
				"</a>"
			),
		};
	}
}

module.exports = SubheadingsDistributionTooLong;
