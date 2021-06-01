import { merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import getSentences from "../../../languageProcessing/helpers/sentence/getSentences";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Returns a score based on the largest percentage of text in
 * which no keyword occurs.
 */
class KeyphraseDistributionAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.goodDistributionScore]
	 *      The average distribution score that needs to be received from the step function to get a GOOD result.
	 * @param {number} [config.parameters.acceptableDistributionScore]
	 *      The average distribution score that needs to be received from the step function to get an OKAY result.
	 * @param {number} [config.scores.good]             The score to return if keyword occurrences are evenly distributed.
	 * @param {number} [config.scores.okay]             The score to return if keyword occurrences are somewhat unevenly distributed.
	 * @param {number} [config.scores.bad]              The score to return if there is way too much text between keyword occurrences.
	 * @param {number} [config.scores.consideration]    The score to return if there are no keyword occurrences.
	 * @param {string} [config.url]                     The URL to the relevant KB article.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				goodDistributionScore: 30,
				acceptableDistributionScore: 50,
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 1,
				consideration: 0,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33q" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33u" ),
		};

		this.identifier = "keyphraseDistribution";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the keyphraseDistribution research and based on this returns an assessment result.
	 *
	 * @param {Paper}      paper      The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed}        i18n       The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._keyphraseDistribution = researcher.getResearch( "keyphraseDistribution" );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( this._keyphraseDistribution.sentencesToHighlight.length > 0 );

		return assessmentResult;
	}

	/**
	 * Calculates the result based on the keyphraseDistribution research.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} Object with score and feedback text.
	 */
	calculateResult( i18n ) {
		const distributionScore = this._keyphraseDistribution.keyphraseDistributionScore;

		if ( distributionScore === 100 ) {
			return {
				score: this._config.scores.consideration,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
					%3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase distribution%3$s: " +
						"%2$sInclude your keyphrase or its synonyms in the text so that we can check keyphrase distribution%3$s."
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( distributionScore > this._config.parameters.acceptableDistributionScore ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
					%3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase distribution%3$s: " +
						"Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. %2$sDistribute them more evenly%3$s."
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( distributionScore > this._config.parameters.goodDistributionScore &&
			distributionScore <= this._config.parameters.acceptableDistributionScore
		) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links to Yoast.com articles,
					%3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase distribution%3$s: " +
						"Uneven. Some parts of your text do not contain the keyphrase or its synonyms. %2$sDistribute them more evenly%3$s."
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.good,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to links to Yoast.com articles, %2$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sKeyphrase distribution%2$s: Good job!"
				),
				this._config.urlTitle,
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
		return this._keyphraseDistribution.sentencesToHighlight;
	}

	/**
	 * Checks whether the paper has a text with at least 15 sentences and a keyword.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is a keyword and a text with 15 sentences or more.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && getSentences( paper.getText() ).length >= 15;
	}
}

export default KeyphraseDistributionAssessment;
