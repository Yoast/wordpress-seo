import { __, sprintf } from "@wordpress/i18n";
import { escape, merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment to check whether the keyphrase only contains function words.
 */
class FunctionWordsInKeyphraseAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.scores.onlyFunctionWords] The score to return if the keyphrase contains only function words.
	 * @param {string} [config.urlTitle] The URL to the relevant KB article.
	 * @param {string} [config.urlCallToAction] The URL to the call-to-action article.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				onlyFunctionWords: 0,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/functionwordskeyphrase-1" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/functionwordskeyphrase-2" ),
		};

		this.identifier = "functionWordsInKeyphrase";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the functionWordsInKeyphrase researcher, based on this returns an assessment result with score.
	 *
	 * @param {Paper} 		paper 		The paper to use for the assessment.
	 * @param {Researcher} 	researcher 	The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		this._functionWordsInKeyphrase = researcher.getResearch( "functionWordsInKeyphrase" );
		this._keyword = escape( paper.getKeyword() );
		const assessmentResult = new AssessmentResult();

		if ( this._functionWordsInKeyphrase ) {
			assessmentResult.setScore( this._config.scores.onlyFunctionWords );
			assessmentResult.setText( sprintf(
				/**
				 * Translators:
				 * %1$s and %2$s expand to links on yoast.com,
				 * %3$s expands to the anchor end tag,
				 * %4$s expands to the focus keyphrase of the article.
				 */
				__(
					// eslint-disable-next-line max-len
					"%1$sFunction words in keyphrase%3$s: Your keyphrase \"%4$s\" contains function words only. %2$sLearn more about what makes a good keyphrase.%3$s",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>",
				this._keyword
			) );
		}

		return assessmentResult;
	}

	/**
	 * Checks if assessment is applicable to the paper.
	 *
	 * @param {Paper} 		paper 			The paper to be analyzed.
	 * @param {Researcher}  researcher  	The researcher object.
	 *
	 * @returns {boolean} Whether the paper has a keyword and the researcher has the relevant research.
	 */
	isApplicable( paper, researcher ) {
		return paper.hasKeyword() && researcher.hasResearch( "functionWordsInKeyphrase" );
	}
}

export default FunctionWordsInKeyphraseAssessment;
