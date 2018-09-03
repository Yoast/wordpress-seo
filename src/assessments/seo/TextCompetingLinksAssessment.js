import { map } from "lodash-es";
import { merge } from "lodash-es";
import { isUndefined } from "lodash-es";

const Assessment = require( "../../assessment" );
const AssessmentResult = require( "../../values/AssessmentResult" );
const Mark = require( "../../values/Mark" );
const addMark = require( "../../markers/addMark" );

/**
 * Assessment to check whether you're linking to a different page with the focus keyword from this page.
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
			url: "<a href='https://yoa.st/2pi' target='_blank'>",
		};

		this.identifier = "textCompetingLinks";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the linkCount module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The AssessmentResult.
	 */
	getResult( paper, researcher, i18n ) {
		const assessmentResult = new AssessmentResult();

		this.linkCount = researcher.getResearch( "getLinkStatistics" );

		const calculatedResult = this.calculateResult( i18n );

		if ( isUndefined( calculatedResult ) ) {
			return assessmentResult;
		}

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );
		assessmentResult.setHasMarks( true );
		assessmentResult.setMarker( this.getMarks() );

		return assessmentResult;
	}

	/**
	 * Determines if the assessment is applicable to the paper.
	 *
	 * @param {Paper} paper The paper to check
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
	 *
	 * @returns {Object} ResultObject with score and text.
	 */
	calculateResult( i18n ) {
		if ( this.linkCount.keyword.totalKeyword > this._config.parameters.recommendedMaximum ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"You're %1$slinking to another page with the focus keyword%2$s you want this page to rank for. " +
						"Consider changing that if you truly want this page to rank."
					),
					this._config.url,
					"</a>"
				),
			};
		}
	}

	/**
	 * Mark the anchors.
	 *
	 * @returns {Array} Array with all the marked anchors.
	 */
	getMarks() {
		return map( this.linkCount.keyword.matchedAnchors, function( matchedAnchor ) {
			return new Mark( {
				original: matchedAnchor,
				marked: addMark( matchedAnchor ),
			} );
		} );
	}
}

export default TextCompetingLinksAssessment;
