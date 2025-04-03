/* eslint-disable no-unused-vars */
import { sprintf } from "@wordpress/i18n";
import { sanitizeString } from "../../languageProcessing";
import { filterShortcodesFromHTML, removeHtmlBlocks } from "../../languageProcessing/helpers";

/**
 * The base class for an Assessment.
 */
class Assessment {
	/**
	 * Executes the assessment and return its result.
	 *
	 * @param {Paper}       paper       The paper to run this assessment on.
	 * @param {Researcher}  researcher  The researcher used for the assessment.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		throw "The method getResult is not implemented";
	}

	/**
	 * Checks whether the assessment is applicable.
	 *
	 * @param {Paper}       paper       The paper to run this assessment on.
	 * @param {Researcher}  researcher  The researcher used for the assessment.
	 *
	 * @returns {boolean} Whether the assessment is applicable, defaults to `true`.
	 */
	isApplicable( paper, researcher ) {
		return true;
	}

	/**
	 * Tests whether a `Paper` has enough content for assessments to be displayed.
	 *
	 * @param {Paper} paper 						The paper to run this assessment on.
	 * @param {number} contentNeededForAssessment	The minimum length in characters a text must have for assessments to be displayed.
	 *
	 * @returns {boolean} `true` if the text is of the required length, `false` otherwise.
	 */
	hasEnoughContentForAssessment( paper, contentNeededForAssessment = 50 ) {
		let text = paper.getText();
		text = removeHtmlBlocks( text );
		text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );

		return sanitizeString( text ).length >= contentNeededForAssessment;
	}

	/**
	 * Formats a string with the URL to the article about a specific assessment.
	 *
	 * @param {string} resultText The string to format.
	 * @param {string} urlTitle The URL to the article about a specific assessment.
	 * @param {string} urlCallToAction The URL to the help article for a specific assessment.
	 * @returns {string} The formatted string.
	 */
	formatResultText( resultText, urlTitle, urlCallToAction ) {
		return sprintf( resultText, urlTitle, urlCallToAction, "</a>" );
	}
}

/* eslint-enable no-unused-vars */

export default Assessment;
