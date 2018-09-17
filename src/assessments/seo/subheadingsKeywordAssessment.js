
import AssessmentResult from "../../values/AssessmentResult";
import Assessment from "../../assessment";
import { merge } from "lodash-es";
import { inRangeStartEndInclusive } from "../../helpers";
import { getSubheadings } from "../../stringProcessing/getSubheadings";

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
class SubHeadingsKeywordAssessment extends Assessment {
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
			parameters: {
				lowerBoundary: 0.3,
				upperBoundary: 0.75,
			},
			scores: {
				noMatches: 3,
				tooFewMatches: 3,
				goodNumberOfMatches: 9,
				tooManyMatches: 3,
			},
			url: "<a href='https://yoa.st/2ph' target='_blank'>",
		};

		this.identifier = "subheadingsKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the matchKeywordInSubheadings research and based on this returns an assessment result.
	 *
	 * @param {Paper} paper             The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 * @param {Object} i18n             The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
		this._minNumberOfSubheadings = Math.ceil( this._subHeadings.count * this._config.parameters.lowerBoundary );
		this._maxNumberOfSubheadings = Math.floor( this._subHeadings.count * this._config.parameters.upperBoundary );

		let assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has a subheadings.
	 *
	 * @param {Paper} paper The paper to use for the check.
	 *
	 * @returns {boolean} True when there is at least one subheading.
	 */
	hasSubheadings( paper ) {
		const subheadings = getSubheadings( paper.getText() );
		return subheadings.length > 0;
	}

	/**
	 * Checks whether the paper has a text and a keyword.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text and a keyword.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && this.hasSubheadings( paper );
	}

	/**
	 * Checks whether there are too few subheadings with the keyword. This is the case if the number of subheadings
	 * with the keyword is more than 0 but less than the specified recommended minimum.
	 *
	 * @returns {boolean} Returns true if the keyword is included in too few subheadings.
	 */
	hasTooFewMatches() {
		return this._subHeadings.matches > 0 && this._subHeadings.matches < this._minNumberOfSubheadings;
	}

	/**
	 * Checks whether there is a good number of subheadings with the keyword. This is the case if there
	 * is only one subheading and that subheading includes the keyword or if the number of subheadings
	 * with the keyword is within the specified recommended range.
	 *
	 * @returns {boolean} Returns true if the keyword is included in a sufficient number of subheadings.
	 */
	hasGoodNumberOfMatches() {
		return ( this._subHeadings.count === 1 && this._subHeadings.matches === 1 ) ||
			inRangeStartEndInclusive( this._subHeadings.matches, this._minNumberOfSubheadings, this._maxNumberOfSubheadings );
	}

	/**
	 * Checks whether there are too many subheadings with the keyword.
	 * The upper limit is only applicable if there is more than one subheading.
	 * If there is only one subheading with the keyword this would otherwise
	 * always lead to a 100% match rate.
	 *
	 * @returns {boolean} Returns true if there is more than one subheading and if
	 * the keyword is included in less subheadings than the recommended maximum.
	 */
	hasTooManyMatches() {
		return this._subHeadings.count > 1 && this._subHeadings.matches > this._maxNumberOfSubheadings;
	}

	/**
	 * Determines the score and the Result text for the subheadings.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} The object with the calculated score and the result text.
	 */
	calculateResult( i18n ) {
		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scores.tooFewMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the total number of subheadings.
					%2$d expands to the number of subheadings containing the keyword,
					%3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The focus keyword appears only in %2$d out of %1$d %3$ssubheadings%4$s. " +
						"Try to use it in more subheadings."
					),
					this._subHeadings.count,
					this._subHeadings.matches,
					this._config.url,
					"</a>"
				),
			};
		}

		if ( this.hasGoodNumberOfMatches() ) {
			return {
				score: this._config.scores.goodNumberOfMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the total number of subheadings.
					%2$d expands to the number of subheadings containing the keyword,
					%3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"The focus keyword appears in %2$d out of %1$d %3$ssubheading%4$s. That's great.",
						"The focus keyword appears in %2$d out of %1$d %3$ssubheadings%4$s. That's great.",
						this._subHeadings.count
					),
					this._subHeadings.count,
					this._subHeadings.matches,
					this._config.url,
					"</a>"
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scores.tooManyMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the total number of subheadings.
					%2$d expands to the number of subheadings containing the keyword,
					%3$s expands to a link on yoast.com, %4$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The focus keyword appears in %2$d out of %1$d %3$ssubheadings%4$s. That might sound a bit repetitive. " +
						"Try to change some of those subheadings to make the flow of your text sound more natural."
					),
					this._subHeadings.count,
					this._subHeadings.matches,
					this._config.url,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.noMatches,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"You have not used the focus keyword in any %1$ssubheading%2$s (such as an H2)."
				),
				this._config.url,
				"</a>"
			),
		};
	}
}

module.exports = SubHeadingsKeywordAssessment;
