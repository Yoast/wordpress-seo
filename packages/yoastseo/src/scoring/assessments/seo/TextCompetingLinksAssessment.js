import { isUndefined, merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment to check whether you're linking to a different page with the keyword from this page.
 */
class TextCompetingLinksAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.recommendedMaximum] The recommended maximum number of links using the same keyword as this paper.
	 * @param {string} [config.scores.bad] The score to return if there are more links with the same keyword than the recommended maximum.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMaximum: 0,
			},
			scores: {
				bad: 2,
			},
			urlTitle: "",
			urlCallToAction: "",
		};

		this.identifier = "textCompetingLinks";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the linkCount module, based on this returns an assessment result with score.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 * @param {Jed}         i18n        The object used for translations.
	 *
	 * @returns {Object} The AssessmentResult.
	 */
	getResult( paper, researcher, i18n ) {
		const assessmentResult = new AssessmentResult();

		this.linkCount = researcher.getResearch( "getLinkStatistics" );

		const calculatedResult = this.calculateResult( i18n, researcher );

		if ( isUndefined( calculatedResult ) ) {
			return assessmentResult;
		}

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( false );

		return assessmentResult;
	}

	/**
	 * Determines if the assessment is applicable to the paper.
	 *
	 * @param {Paper}       paper       The paper to check
	 *
	 * @returns {boolean} Whether the paper has text and a keyword
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword();
	}

	/**
	 * Returns a result based on the number of links.
	 *
	 * @param {Jed} i18n The object used for translations.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @returns {Object} ResultObject with score and text.
	 */
	calculateResult( i18n, researcher ) {
		let urlTitle = this._config.urlTitle;
		let urlCallToAction = this._config.urlCallToAction;
		// Get the links
		const links = researcher.getData( "links" );
		// Check if links for the assessment is available in links data
		if ( links[ "shortlinks.metabox.SEO.competing_links" ] && links[ "shortlinks.metabox.SEO.titleCall_to_action" ] ) {
			// Overwrite default links with links from configuration
			urlTitle = createAnchorOpeningTag( links[ "shortlinks.metabox.SEO.competing_links" ] );
			urlCallToAction = createAnchorOpeningTag( links[ "shortlinks.metabox.SEO.titleCall_to_action" ] );
		}
		// Calculate scores
		if ( this.linkCount.keyword.totalKeyword > this._config.parameters.recommendedMaximum ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators:  %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sLink keyphrase%3$s: " +
						"You're linking to another page with the words you want this page to rank for. " +
						"%2$sDon't do that%3$s!"
					),
					urlTitle,
					urlCallToAction,
					"</a>"
				),
			};
		}
	}
}

export default TextCompetingLinksAssessment;
