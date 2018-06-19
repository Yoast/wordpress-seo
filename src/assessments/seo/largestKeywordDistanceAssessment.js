const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );
const merge = require( "lodash/merge" );
const countWords = require( "../../stringProcessing/countWords.js" );
const matchWords = require( "../../stringProcessing/matchTextWithWord.js" );
const Mark = require( "../../values/Mark.js" );
const marker = require( "../../markers/addMark.js" );
const inRangeStartEndInclusive = require( "../../helpers/inRange.js" ).inRangeStartEndInclusive;

/**
 * Returns a score based on the largest percentage of text in
 * which no keyword occurs.
 */
class largestKeywordDistanceAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			overRecommendedMaximumKeywordDistance: 40,
			recommendedMaximumKeywordDistance: 30,
			scores: {
				good: 9,
				okay: 6,
				bad: 1,
			},
		};

		this.identifier = "largestKeywordDistance";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the largestKeywordDistance research and based on this returns an assessment result.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 * @param {Object}      i18n        The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._largestKeywordDistance = researcher.getResearch( "largestKeywordDistance" );
		let assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( calculatedResult.score < 2 );

		return assessmentResult;
	}

	/**
	 *  Calculates the result based on the largestKeywordDistance research.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} Object with score and feedback text.
	 */
	calculateResult( i18n ) {
		if ( this._largestKeywordDistance > this._config.overRecommendedMaximumKeywordDistance ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf( i18n.dgettext(
					"js-text-analysis",
					"Large parts of your text do not contain the keyword. " +
					"Try to distribute the keyword more evenly." ) ),
			};
		}

		if ( inRangeStartEndInclusive(
			this._largestKeywordDistance,
			this._config.recommendedMaximumKeywordDistance,
			this._config.overRecommendedMaximumKeywordDistance ) ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf( i18n.dgettext(
					"js-text-analysis",
					"Some parts of your text do not contain the keyword. " +
					"Try to distribute the keyword more evenly." ) ),
			};
		}

		return {
			score: this._config.scores.good,
			resultText: i18n.sprintf( i18n.dgettext(
				"js-text-analysis",
				"Your keyword is distributed evenly throughout the text. " +
				"That's great." ) ),
		};
	}

	/**
	 * Creates a marker for the keyword.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {Array} All markers for the current text.
	 */
	getMarks( paper ) {
		const keyword = paper.getKeyword();

		return [ new Mark( {
			original: keyword,
			marked: marker( keyword ),
		} ) ];
	}

	/**
	 * Checks whether the paper has a text with at least 200 words, a keyword, and whether
	 * the keyword appears more at least twice in the text (required to calculate a distribution).
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is a keyword and a text with 200 words or more,
	 *                    with the keyword occurring more than one time.
	 */
	isApplicable( paper ) {
		const keywordCount = matchWords( paper.getText(), paper.getKeyword(), paper.getLocale() );

		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 200 && keywordCount > 1;
	}
}

module.exports = largestKeywordDistanceAssessment;
