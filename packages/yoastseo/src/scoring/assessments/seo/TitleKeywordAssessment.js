import { escape, merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment to check whether the keyword is included in (the beginning of) the SEO title.
 */
class TitleKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.recommendedPosition] The recommended position of the keyword within the title.
	 * @param {number} [config.scores.good] The score to return if the keyword is found at the recommended position.
	 * @param {number} [config.scores.okay] The score to return if the keyword is found, but not at the recommended position.
	 * @param {number} [config.scores.bad] The score to return if there are fewer keyword occurrences than the recommended minimum.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedPosition: 0,
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 2,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33g" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33h" ),
		};

		this.identifier = "titleKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the pagetitle keyword assessment and returns an assessment result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 * @param {Jed}         i18n        The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of the assessment with text and score.
	 */
	getResult( paper, researcher, i18n ) {
		this._keywordMatches = researcher.getResearch( "findKeywordInPageTitle" );
		this._keyword = escape( paper.getKeyword() );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n, this._keyword );
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the assessment is applicable to the paper
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 *
	 * @returns {boolean} Whether the paper has a keyword and a title.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && paper.hasTitle();
	}

	/**
	 * Calculates the result based on whether and how the keyphrase was matched in the title. Returns GOOD result if
	 * an exact match of the keyword is found in the beginning of the title. Returns OK results if all content words
	 * from the keyphrase are in the title (in any form). Returns BAD otherwise.
	 *
	 * @param {Jed}     i18n        The object used for translations.
	 * @param {string}  keyword     The keyword of the paper (to be returned in the feedback strings).
	 *
	 * @returns {Object} Object with score and text.
	 */
	calculateResult( i18n, keyword ) {
		const exactMatchFound = this._keywordMatches.exactMatchFound;
		const position = this._keywordMatches.position;
		const allWordsFound = this._keywordMatches.allWordsFound;
		const exactMatchKeyphrase = this._keywordMatches.exactMatchKeyphrase;

		if ( exactMatchFound === true ) {
			if ( position === 0 ) {
				return {
					score: this._config.scores.good,
					resultText: i18n.sprintf(
						/* Translators: %1$s expands to a link on yoast.com,
						%2$s expands to the anchor end tag. */
						i18n.dgettext(
							"js-text-analysis",
							"%1$sKeyphrase in title%2$s: The exact match of the focus keyphrase appears at the beginning " +
							"of the SEO title. Good job!"
						),
						this._config.urlTitle,
						"</a>"
					),
				};
			}
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com,
					%3$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in title%3$s: The exact match of the focus keyphrase appears in the SEO title, but not " +
						"at the beginning. %2$sMove it to the beginning for the best results%3$s."
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( allWordsFound ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com,
					%3$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in title%3$s: Does not contain the exact match. %2$sTry to write the exact match of " +
						"your keyphrase in the SEO title and put it at the beginning of the title%3$s."
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( exactMatchKeyphrase ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com,
					%3$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in title%3$s: Does not contain the exact match. %2$sTry to write the exact match of " +
						"your keyphrase in the SEO title and put it at the beginning of the title%3$s."
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>",
					keyword
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to a link on yoast.com,
				%3$s expands to the anchor end tag, %4$s expands to the keyword of the article. */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sKeyphrase in title%3$s: Not all the words from your keyphrase \"%4$s\" appear in the SEO title. " +
					"%2$sFor the best SEO results write the exact match of your keyphrase in the SEO title, and put " +
					"the keyphrase at the beginning of the title%3$s."
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>",
				keyword
			),
		};
	}
}

export default TitleKeywordAssessment;
