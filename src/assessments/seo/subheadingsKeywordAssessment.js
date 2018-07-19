const merge = require( "lodash/merge" );

const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
class SubHeadingsKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			scores: {
				noMatches: 6,
				oneMatch: 9,
				multipleMatches: 9,
			},
		};

		this.identifier = "subheadingsKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		let subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
		let assessmentResult = new AssessmentResult();
		let score = this.calculateScore( subHeadings );

		assessmentResult.setScore( score );
		assessmentResult.setText( this.translateScore( score, subHeadings, i18n ) );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has a text and a keyword.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text and a keyword.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword();
	}

	/**
	 * Returns the score for the subheadings.
	 *
	 * @param {Object} subHeadings The object with all subHeadings matches.
	 *
	 * @returns {number|null} The calculated score.
	 */
	calculateScore( subHeadings ) {
		if ( subHeadings.matches === 0 ) {
			return this._config.scores.noMatches;
		}
		if ( subHeadings.matches === 1 ) {
			return this._config.scores.oneMatch;
		}

		if ( subHeadings.matches > 1 ) {
			return this._config.scores.multipleMatches;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} score The score for this assessment.
	 * @param {Object} subHeadings The object with all subHeadings matches.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( score, subHeadings, i18n ) {
		const url = "<a href='https://yoa.st/2ph' target='_blank'>";

		if ( score === this._config.scores.multipleMatches || score === this._config.scores.oneMatch ) {
			return i18n.sprintf(
				/* Translators: %1$d expands to the number of subheadings containing the keyword, %2$d expands to the
				total number of subheadings, %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "The focus keyword appears in %1$d (out of %2$d) %3$ssubheadings%4$s in your copy." ),
				subHeadings.matches, subHeadings.count, url, "</a>"
			);
		}

		if ( score === this._config.scores.noMatches ) {
			return i18n.sprintf(
				/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"You have not used the focus keyword in any %1$ssubheading%2$s (such as an H2) in your copy."
				), url, "</a>" );
		}

		return "";
	}
}

module.exports = SubHeadingsKeywordAssessment;
