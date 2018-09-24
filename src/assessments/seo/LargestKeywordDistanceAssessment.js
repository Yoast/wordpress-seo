import { merge } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";
import countWords from "../../stringProcessing/countWords";
import topicCount from "../../researches/topicCount";
import { inRangeStartEndInclusive } from "../../helpers/inRange";

/**
 * Returns a score based on the largest percentage of text in
 * which no keyword occurs.
 */
class LargestKeywordDistanceAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.overRecommendedMaximumKeywordDistance]
	 *      The percentage of the text that is already way too high to be allowed to be in between two keyword occurrences.
	 * @param {number} [config.parameters.recommendedMaximumKeywordDistance]
	 *      The percentage of the text that is maximally allowed to be in between two keyword occurrences.
	 * @param {number} [config.scores.good] The score to return if there is not too much text between keyword occurrences.
	 * @param {number} [config.scores.okay] The score to return if there is somewhat much text between keyword occurrences.
	 * @param {number} [config.scores.bad] The score to return if there is way too much text between keyword occurrences.
	 * @param {string} [config.url] The URL to the relevant KB article.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				overRecommendedMaximumKeywordDistance: 50,
				recommendedMaximumKeywordDistance: 40,
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 1,
				consideration: 0,
			},
			url: "<a href='https://yoa.st/2w7' target='_blank'>",
		};

		this.identifier = "largestKeywordDistance";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the largestKeywordDistance research and based on this returns an assessment result.
	 *
	 * @param {Paper}      paper      The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed}        i18n       The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._largestKeywordDistance = researcher.getResearch( "largestKeywordDistance" );

		this._hasSynonyms = paper.hasSynonyms();
		this._topicUsed = topicCount( paper ).count;

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( calculatedResult.score > 0 );

		return assessmentResult;
	}

	/**
	 * Calculates the result based on the largestKeywordDistance research.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} Object with score and feedback text.
	 */
	calculateResult( i18n ) {
		if ( this._topicUsed < 2 ) {
			return {
				score: this._config.scores.consideration,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link to a Yoast.com article about keyword and topic distribution,
					%2$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"Use your keyword or synonyms more often in your text so that we can check %1$skeyword distribution%2$s."
					),
					this._config.url,
					"</a>"
				),
			};
		}

		if ( this._largestKeywordDistance > this._config.parameters.overRecommendedMaximumKeywordDistance ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link to a Yoast.com article about keyword and topic distribution,
					%2$s expands to the anchor end tag */
					i18n.dngettext(
						"js-text-analysis",
						"Large parts of your text do not contain the keyword. Try to %1$sdistribute%2$s the keyword more evenly.",
						"Large parts of your text do not contain the keyword or its synonyms. Try to %1$sdistribute%2$s them more evenly.",
						this._hasSynonyms + 1
					),
					this._config.url,
					"</a>"
				),
			};
		}

		if ( inRangeStartEndInclusive(
			this._largestKeywordDistance,
			this._config.parameters.recommendedMaximumKeywordDistance,
			this._config.parameters.overRecommendedMaximumKeywordDistance ) ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link to a Yoast.com article about keyword and topic distribution,
					%2$s expands to the anchor end tag */
					i18n.dngettext(
						"js-text-analysis",
						"Some parts of your text do not contain the keyword. Try to %1$sdistribute%2$s the keyword more evenly.",
						"Some parts of your text do not contain the keyword or its synonyms. Try to %1$sdistribute%2$s them more evenly.",
						this._hasSynonyms + 1
					),
					this._config.url,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.good,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link to a Yoast.com article about keyword and topic distribution,
				%2$s expands to the anchor end tag */
				i18n.dngettext(
					"js-text-analysis",
					"Your keyword is %1$sdistributed%2$s evenly throughout the text. That's great.",
					"Your keyword and its synonyms are %1$sdistributed%2$s evenly throughout the text. That's great.",
					this._hasSynonyms + 1
				),
				this._config.url,
				"</a>"
			),
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
		return topicCount( paper ).markings;
	}


	/**
	 * Checks whether the paper has a text with at least 200 words and a keyword.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is a keyword and a text with 200 words or more.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 200;
	}
}

export default LargestKeywordDistanceAssessment;
