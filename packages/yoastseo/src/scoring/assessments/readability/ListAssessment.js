import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import { merge } from "lodash-es";

/**
 * Represents the assessment that will look if the text has a list (only applicable for product pages).
 */
export default class ListAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: "",
			urlCallToAction: "",
			scores: {
				bad: 3,
				good: 9,
			},
		};

		this._config = merge( defaultConfig, config );

		this.identifier = "listsPresence";
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 * @param {Jed}         i18n        The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		this.textContainsList = researcher.getResearch( "findList" );

		const calculatedScore = this.calculateResult( i18n, researcher );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Calculate the result based on the availability of lists in the text.
	 *
	 * @param {Object} i18n The object used for translations.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult( i18n, researcher ) {
		let urlTitle = this._config.urlTitle;
		let urlCallToAction = this._config.urlCallToAction;
		// Get the links
		const links = researcher.getData( "links" );
		// Check if links for the assessment is available in links data
		if ( links[ "shortlinks.metabox.readability.list" ] &&
			links[ "shortlinks.metabox.readability.listCall_to_action" ] ) {
			// Overwrite default links with links from configuration
			urlTitle = createAnchorOpeningTag( links[ "shortlinks.metabox.readability.list" ] );
			urlCallToAction = createAnchorOpeningTag( links[ "shortlinks.metabox.readability.listCall_to_action" ] );
		}
		// Calculates scores
		// Text with at least one list.
		if ( this.textContainsList ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sLists%2$s: There is at least one list on this page. Great!"
					),
					urlTitle,
					"</a>"
				),
			};
		}

		// Text with no lists.
		return {
			score: this._config.scores.bad,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com,
				 * %2$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sLists%3$s: No lists appear on this page. %2$sAdd at least one ordered or unordered list%3$s!"
				),
				urlTitle,
				urlCallToAction,
				"</a>"
			),
		};
	}
}
