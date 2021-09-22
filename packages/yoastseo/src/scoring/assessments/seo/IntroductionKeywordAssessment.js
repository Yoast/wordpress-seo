import { merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment to check whether the keyphrase or synonyms are encountered in the first paragraph of the article.
 */
class IntroductionKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.scores.good] The score to return if there is a match within one sentence in the first paragraph.
	 * @param {number} [config.scores.okay] The score to return if all words are matched in the first paragraph.
	 * @param {number} [config.scores.bad] The score to return if not all words are matched in the first paragraph.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				good: 9,
				okay: 6,
				bad: 3,
			},
			urlTitle: "",
			urlCallToAction: "",
		};

		this.identifier = "introductionKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses the presence of keyphrase or synonyms in the first paragraph.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	getResult( paper, researcher, i18n ) {
		const assessmentResult = new AssessmentResult();

		this._firstParagraphMatches = researcher.getResearch( "findKeywordInFirstParagraph" );
		const calculatedResult = this.calculateResult( i18n, researcher );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks if the paper has both keyword and text.
	 *
	 * @param {Paper} paper The paper to be analyzed.
	 *
	 * @returns {boolean} Whether the assessment is applicable or not.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && paper.hasText();
	}

	/**
	 * Returns a result based on the number of occurrences of keyphrase in the first paragraph.
	 *
	 * @param {Jed} i18n The object used for translations.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @returns {Object} result object with a score and translation text.
	 */
	calculateResult( i18n, researcher ) {
		let urlTitle = this._config.urlTitle;
		let urlCallToAction = this._config.urlCallToAction;
		// Get the links
		const links = researcher.getData( "links" );
		// Check if links for the assessment is available in links data
		if ( links[ "shortlinks.metabox.SEO.introduction_keword" ] && links[ "shortlinks.metabox.SEO.introduction_kewordCall_to_action" ] ) {
			// Overwrite default links with links from configuration
			urlTitle = createAnchorOpeningTag( links[ "shortlinks.metabox.SEO.introduction_keword" ] );
			urlCallToAction = createAnchorOpeningTag( links[ "shortlinks.metabox.SEO.introduction_kewordCall_to_action" ] );
		}
		// Calculates scores
		if ( this._firstParagraphMatches.foundInOneSentence ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in introduction%2$s: Well done!"
					),
					urlTitle,
					"</a>"
				),
			};
		}

		if ( this._firstParagraphMatches.foundInParagraph ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in introduction%3$s:" +
						" Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. %2$sFix that%3$s!"
					),
					urlTitle,
					urlCallToAction,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sKeyphrase in introduction%3$s: Your keyphrase or its synonyms do not appear in the first paragraph. " +
					"%2$sMake sure the topic is clear immediately%3$s."
				),
				urlTitle,
				urlCallToAction,
				"</a>"
			),
		};
	}
}

export default IntroductionKeywordAssessment;
