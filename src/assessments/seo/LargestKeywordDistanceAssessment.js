import { merge } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";
import countWords from "../../stringProcessing/countWords";
import Mark from "../../values/Mark";
import addMark from "../../markers/addMarkSingleWord";

/**
 * Returns a score based on the largest percentage of text in
 * which no keyword occurs.
 */
class LargestKeywordDistanceAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.recommendedAverageDistributionScore]
	 *      The average distribution score that needs to be received from the step function to get a GOOD result.
	 * @param {number} [config.parameters.lowAverageDistributionScore]
	 *      The average distribution score that needs to be received from the step function to get an OKAY result.
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
				recommendedAverageDistributionScore: 6,
				lowAverageDistributionScore: 3,
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 1,
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
		const averageScore = this._largestKeywordDistance.averageScore;
		if ( averageScore <= this._config.parameters.lowAverageDistributionScore ) {
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

		if ( averageScore < this._config.parameters.recommendedAverageDistributionScore ) {
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
	 * Creates a marker for all content words in keyphrase and synonyms.
	 *
	 * @returns {Array} All markers for the current text.
	 */
	getMarks() {
		console.log( this._largestKeywordDistance.formsToHighlight.map( function( form ) {
			return new Mark( { original: form, marked: addMark( form ) } );
		} ) );

		return this._largestKeywordDistance.formsToHighlight.map( function( form ) {
			return new Mark( { original: form, marked: addMark( form ) } );
		} );
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
