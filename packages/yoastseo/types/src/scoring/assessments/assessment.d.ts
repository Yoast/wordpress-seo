export default Assessment;
/**
 * The base class for an Assessment.
 */
declare class Assessment {
    /**
     * Executes the assessment and return its result.
     *
     * @param {Paper}       paper       The paper to run this assessment on.
     * @param {Researcher}  researcher  The researcher used for the assessment.
     *
     * @returns {AssessmentResult} The result of the assessment.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Checks whether the assessment is applicable.
     *
     * @param {Paper}       paper       The paper to run this assessment on.
     * @param {Researcher}  researcher  The researcher used for the assessment.
     *
     * @returns {boolean} Whether the assessment is applicable, defaults to `true`.
     */
    isApplicable(paper: Paper, researcher: Researcher): boolean;
    /**
     * Tests whether a `Paper` has enough content for assessments to be displayed.
     *
     * @param {Paper} paper 						The paper to run this assessment on.
     * @param {number} contentNeededForAssessment	The minimum length in characters a text must have for assessments to be displayed.
     *
     * @returns {boolean} `true` if the text is of the required length, `false` otherwise.
     */
    hasEnoughContentForAssessment(paper: Paper, contentNeededForAssessment?: number): boolean;
    /**
     * Formats a string with the URL to the article about a specific assessment.
     *
     * @param {string} resultText The string to format.
     * @param {string} urlTitle The URL to the article about a specific assessment.
     * @param {string} urlCallToAction The URL to the help article for a specific assessment.
     * @returns {string} The formatted string.
     */
    formatResultText(resultText: string, urlTitle: string, urlCallToAction: string): string;
}
