import { __, sprintf } from "@wordpress/i18n";
import { escape, merge } from "lodash";
import getLanguage from "../../../languageProcessing/helpers/language/getLanguage";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Assessment to check whether the keyphrase is included in (the beginning of) the SEO title.
 */
export default class KeyphraseInSEOTitleAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters] The parameters to use.
	 * @param {number} [config.parameters.recommendedPosition] The recommended position of the keyphrase within the SEO title.
	 * @param {Object} [config.scores] The scores to use.
	 * @param {number} [config.scores.good] The score to return if the keyphrase is found at the recommended position.
	 * @param {number} [config.scores.okay] The score to return if the keyphrase is found, but not at the recommended position.
	 * @param {number} [config.scores.bad] The score to return if there are fewer keyphrase occurrences than the recommended minimum.
	 * @param {string} [config.urlTitle] The URL to the relevant article on Yoast.com to add to the title of the assessment in the feedback.
	 * @param {string} [config.urlCallToAction] The URL to the relevant article on Yoast.com to add to the call to action in the assessment feedback.
	 * @param {Object} [config.feedbackStrings] The feedback strings to use.
	 * @param {string} [config.feedbackStrings.bad] The feedback string to use when the assessment gives a bad score.
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
			feedbackStrings: {
				bad: __( "For the best SEO results write the exact match of your keyphrase in the SEO title, " +
					"and put the keyphrase at the beginning of the title", "wordpress-seo" ),
			},
		};

		this.identifier = "keyphraseInSEOTitle";

		/* translators: This is the name of the 'Keyphrase in SEO title' SEO assessment.
		 It appears before the feedback in the analysis, for example in the feedback string:
		 "Keyphrase in SEO title: The focus keyphrase appears at the beginning of the SEO title. Good job!" */
		this.name = __( "Keyphrase in SEO title", "wordpress-seo" );

		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the SEO title keyphrase assessment and returns an assessment result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment with text and score.
	 */
	getResult( paper, researcher ) {
		const language = getLanguage( paper.getLocale() );
		// Whether the paper has the data needed to return meaningful feedback (keyphrase and SEO title).
		this._canAssess = false;

		if ( paper.hasKeyword() && paper.hasTitle() ) {
			this._keyphraseMatches = researcher.getResearch( "findKeyphraseInSEOTitle" );
			this._keyphrase = escape( paper.getKeyword() );
			this._canAssess = true;
		}

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( this._keyphrase, language );
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		if ( assessmentResult.getScore() < 9 && this._canAssess ) {
			assessmentResult.setHasJumps( true );
			assessmentResult.setEditFieldName( __( "SEO title", "wordpress-seo" ) );
		}

		return assessmentResult;
	}

	/**
	 * Calculates the result based on whether and how the keyphrase was matched in the SEO title. Returns GOOD result if
	 * an exact match of the keyphrase is found in the beginning of the SEO title. Returns OK results if all content words
	 * from the keyphrase are in the SEO title (in any form). Returns BAD otherwise.
	 *
	 * @param {string}  keyphrase   The keyphrase of the paper (to be returned in the feedback strings).
	 * @param {string}  language    The language to check.
	 *
	 * @returns {{score: number, resultText: string}} Object with score and text.
	 */
	calculateResult( keyphrase, language ) {
		const assessmentLink = this._config.urlTitle + this.name + "</a>";

		if ( ! this._canAssess ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
					 and links to an article on yoast.com. %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$s: %2$sPlease add both a keyphrase and an SEO title beginning with the keyphrase%3$s.",
						"wordpress-seo"
					),
					assessmentLink,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		const feedbackStrings = this._config.feedbackStrings;
		if ( language === "ja" ) {
			feedbackStrings.bad = __( "For the best SEO results include all words of your keyphrase in the SEO title, " +
					"and put the keyphrase at the beginning of the title", "wordpress-seo" );
		}
		const exactMatchFound = this._keyphraseMatches.exactMatchFound;
		const position = this._keyphraseMatches.position;
		const allWordsFound = this._keyphraseMatches.allWordsFound;
		const exactMatchKeyphrase = this._keyphraseMatches.exactMatchKeyphrase;

		if ( exactMatchFound === true ) {
			if ( position === 0 ) {
				return {
					score: this._config.scores.good,
					resultText: sprintf(
						/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
						 and links to an article on yoast.com. */
						__(
							"%1$s: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!",
							"wordpress-seo"
						),
						assessmentLink
					),
				};
			}
			return {
				score: this._config.scores.okay,
				resultText: sprintf(
					/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
					 and links to an article on yoast.com. %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$s: The exact match of the focus keyphrase appears in the SEO title, but not at the beginning. %2$sMove it to the beginning for the best results%3$s.",
						"wordpress-seo"
					),
					assessmentLink,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( allWordsFound ) {
			if ( language === "ja" ) {
				if ( position === 0 ) {
					return {
						score: this._config.scores.good,
						resultText: sprintf(
							/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
							 and links to an article on yoast.com. */
							__(
								"%1$s: The focus keyphrase appears at the beginning of the SEO title. Good job!",
								"wordpress-seo"
							),
							assessmentLink,
							"</a>"
						),
					};
				}
				return {
					score: this._config.scores.okay,
					resultText: sprintf(
						/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
						 and links to an article on yoast.com. %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
						__(
							"%1$s: Title does not begin with the focus keyphrase. %2$sMove your focus keyphrase to the beginning of the title%3$s.",
							"wordpress-seo"
						),
						assessmentLink,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			return {
				score: this._config.scores.okay,
				resultText: sprintf(
					/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
					 and links to an article on yoast.com. %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$s: Does not contain the exact match. %2$sTry to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title%3$s.",
						"wordpress-seo"
					),
					assessmentLink,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( exactMatchKeyphrase ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
					 and links to an article on yoast.com. %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					__(
						"%1$s: Does not contain the exact match. %2$sTry to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title%3$s.",
						"wordpress-seo"
					),
					assessmentLink,
					this._config.urlCallToAction,
					"</a>",
					keyphrase
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: sprintf(
				/* translators: %1$s expands to the title of the "Keyphrase in SEO title" assessment (translated to the current language)
				 and links to an article on yoast.com. %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
				 %4$s expands to the keyphrase of the article, %5$s expands to the call to action text. */
				__(
					"%1$s: Not all the words from your keyphrase \"%4$s\" appear in the SEO title. %2$s%5$s%3$s.",
					"wordpress-seo"
				),
				assessmentLink,
				this._config.urlCallToAction,
				"</a>",
				keyphrase,
				feedbackStrings.bad
			),
		};
	}
}
