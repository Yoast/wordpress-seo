const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );
const merge = require( "lodash/merge" );
const map = require( "lodash/map" );
const countWords = require( "../../stringProcessing/countWords.js" );
const topicCount = require( "../../researches/topicCount.js" );
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
			overRecommendedMaximumKeywordDistance: 50,
			recommendedMaximumKeywordDistance: 40,
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

		this._hasSynonyms = this.hasSynonyms( paper );

		let assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( calculatedResult.score < 9 );

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
		if ( this._hasSynonyms ) {
			this._config.overRecommendedMaximumKeywordDistance = 40;
			this._config.recommendedMaximumKeywordDistance = 30;
		}

		if ( this._largestKeywordDistance > this._config.overRecommendedMaximumKeywordDistance ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf( i18n.dngettext(
					"js-text-analysis",
					"Large parts of your text do not contain the keyword. Try to distribute the keyword more evenly.",
					"Large parts of your text do not contain the keyword or its synonyms. Try to distribute them more evenly.",
					this._hasSynonyms + 1
				) ),
			};
		}

		if ( inRangeStartEndInclusive(
			this._largestKeywordDistance,
			this._config.recommendedMaximumKeywordDistance,
			this._config.overRecommendedMaximumKeywordDistance ) ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf( i18n.dngettext(
					"js-text-analysis",
					"Some parts of your text do not contain the keyword. Try to distribute the keyword more evenly.",
					"Some parts of your text do not contain the keyword or its synonyms. Try to distribute them more evenly.",
					this._hasSynonyms + 1
				) ),
			};
		}

		return {
			score: this._config.scores.good,
			resultText: i18n.sprintf( i18n.dngettext(
				"js-text-analysis",
				"Your keyword is distributed evenly throughout the text. That's great.",
				"Your keyword and its synonyms are distributed evenly throughout the text. That's great.",
				this._hasSynonyms + 1
			) ),
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
		const topicMatches = topicCount( paper ).matches;
		return map( topicMatches, function( topicWord ) {
			return new Mark( {
				original: topicWord,
				marked: marker( topicWord ),
			} );
		} );
	}

	/**
	 * Checks if the paper has synonyms to apply different criteria to the assessment and to isApplicable depending on
	 * whether synonyms are supplied.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} Whether the paper has synonyms or not
	 */
	hasSynonyms( paper ) { // todo: this function can be deprecated as soon as the Synonym interface is ready
		return paper.getKeyword().indexOf( "," ) > 0;
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
		const topicUsed = topicCount( paper ).count;

		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 200 && topicUsed > 1;
	}
}

module.exports = largestKeywordDistanceAssessment;
