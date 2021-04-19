import { map } from "lodash-es";
import { merge } from "lodash-es";
import { isUndefined } from "lodash-es";

import Assessment from "../assessment.js";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import marker from "../../../markers/addMark.js";
import AssessmentResult from "../../../values/AssessmentResult.js";
import Mark from "../../../values/Mark.js";

/**
 * Assessment to check whether the body of the text contains H1s in the body (except at the very beginning,
 * where they are acceptable).
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
	 * @param {Jed}         i18n        The object used for translations
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._h1s = researcher.getResearch( "h1s" );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );

		if ( ! isUndefined( calculatedResult ) ) {
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( calculatedResult.resultText );
			assessmentResult.setHasMarks( true );
		}

		return assessmentResult;
	}

	/**
	 * Checks whether an H1 is in the first position of the body.
	 *
	 * @returns {boolean} Returns true if there is an H1 in the first position of the body.
	 */
	firstH1AtBeginning() {
		return ( this._h1s[ 0 ].position === 0 );
	}

	/**
	 * Returns the score and the feedback string for the single H1 assessment.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object|null} The calculated score and the feedback string.
	 */
	calculateResult( i18n ) {
		// Returns the default assessment result if there are no H1s in the body.
		if ( this._h1s.length === 0 ) {
			return;
		}

		// Returns the default assessment result if there is one H1 and it's at the beginning of the body.
		if ( this._h1s.length === 1 && this.firstH1AtBeginning() ) {
			return;
		}

		return {
			score: this._config.scores.textContainsSuperfluousH1,
			resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sSingle title%3$s: H1s should only be used as your main title. Find all H1s in your text " +
					"that aren't your main title and %2$schange them to a lower heading level%3$s!"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}

	/**
	 * Marks all H1s in the body of the text (except at the very beginning,
	 * where they are acceptable and don't need to be changed).
	 *
	 * @returns {Array} Array with all the marked H1s.
	 */
	getMarks() {
		const h1s = this._h1s;

		/*
		 * Removes the first H1 from the array if that H1 is in the first position of the body.
		 * The very beginning of the body is the only position where an H1 is deemed acceptable.
		 */
		if ( this.firstH1AtBeginning() ) {
			h1s.shift();
		}

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
