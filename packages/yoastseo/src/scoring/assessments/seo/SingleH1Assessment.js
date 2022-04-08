import { __, sprintf } from "@wordpress/i18n";
import { map } from "lodash-es";
import { merge } from "lodash-es";
import { isUndefined } from "lodash-es";

import Assessment from "../assessment.js";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import marker from "../../../markers/addMark.js";
import AssessmentResult from "../../../values/AssessmentResult.js";
import Mark from "../../../values/Mark.js";

/**
 * Assessment to check whether the body of the text contains more than 1 H1s in the body.
 * This assessment doesn't penalize H1 that is not in the very beginning of the body.
 */
class singleH1Assessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				textContainsSuperfluousH1: 1,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/3a6" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/3a7" ),
		};

		this.identifier = "singleH1";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the h1 research and based on this returns an assessment result with a score.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling the research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		this._h1s = researcher.getResearch( "h1s" );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult();

		if ( ! isUndefined( calculatedResult ) ) {
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( calculatedResult.resultText );
			assessmentResult.setHasMarks( true );
		}

		return assessmentResult;
	}

	/**
	 * Returns the score and the feedback string for the single H1 assessment.
	 *
	 * @returns {Object|null} The calculated score and the feedback string.
	 */
	calculateResult() {
		// Returns the default assessment result if the h1 is not more than 1 in the body, regardless of its position.
		if ( this._h1s.length <= 1 ) {
			return;
		}

		return {
			score: this._config.scores.textContainsSuperfluousH1,
			resultText: sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					// eslint-disable-next-line max-len
					"%1$sSingle title%3$s: H1s should only be used as your main title. Find all H1s in your text that aren't your main title and %2$schange them to a lower heading level%3$s!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}

	/**
	 * Marks all H1s in the body of the text, regardless of their position in the text.
	 *
	 * @returns {Array} Array with all the marked H1s.
	 */
	getMarks() {
		const h1s = this._h1s;

		return map( h1s, function( h1 ) {
			return new Mark( {
				original: "<h1>" + h1.content + "</h1>",
				marked: "<h1>" + marker( h1.content ) + "</h1>",
			} );
		} );
	}

	/**
	 * Checks whether the paper has a text.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}
}

export default singleH1Assessment;
