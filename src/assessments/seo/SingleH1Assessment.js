import map from "lodash/map";
import merge from "lodash/merge";

import Assessment from "../../assessment.js";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";
import marker from "../../markers/addMark.js";
import AssessmentResult from "../../values/AssessmentResult.js";
import Mark from "../../values/Mark.js";

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
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling the research.
	 * @param {Object} i18n The object used for translations
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._h1s = researcher.getResearch( "h1s" );

		const assessmentResult = new AssessmentResult();

		// Returns the default assessment result if there are no H1s in the body.
		if ( this._h1s.length === 0 ) {
			return assessmentResult;
		}

		/*
		 * Removes the first H1 from the array if that H1 is in the first position of the body.
		 * The very beginning of the body is the only position where an H1 is deemed acceptable.
		 */
		if ( this.firstH1AtBeginning() ) {
			this._h1s.shift();
		}

		assessmentResult.setScore( this.calculateScore() );
		assessmentResult.setText( this.translateScore( i18n ) );
		assessmentResult.setHasMarks( ( this.calculateScore() < 2 ) );

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
	 * Checks whether there are superfluous (i.e., non-title) H1s in the text.
	 *
	 * @returns {boolean} Returns true if there are superfluous H1s in the text.
	 */
	bodyContainsSuperfluousH1s() {
		return ( this._h1s.length >= 1 );
	}

	/**
	 * Returns the score for the single H1 assessment.
	 *
	 * @returns {number} The calculated score.
	 */
	calculateScore() {
		if ( this.bodyContainsSuperfluousH1s() ) {
			return this._config.scores.textContainsSuperfluousH1;
		}
	}

	/**
	 * Translates the score of the single H1 assessment to a message the user can understand.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( i18n ) {
		if ( this.bodyContainsSuperfluousH1s() ) {
			return i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sSingle title%3$s. H1s should only be used as your main title. Find all H1s in your text " +
					"that aren't your main title. %2$sUse a lower heading level%3$s!"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			);
		}
	}

	/**
	 * Marks all H1s in the body of the text (except at the very beginning,
	 * where they are acceptable and don't need to be changed).
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
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}
}

export default singleH1Assessment;
