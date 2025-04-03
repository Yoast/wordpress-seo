export default SlugKeywordAssessment;
/**
 * Represents the Slug keyword assessment. This assessment checks if the keyword is present in the slug.
 */
export class SlugKeywordAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} config   The configuration to use.
     * @returns {void}
     */
    constructor(config?: Object);
    identifier: string;
    _config: {
        scores: {
            okay: number;
            good: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Executes the Assessment and returns a result.
     *
     * @param {Paper}       paper       The Paper object to assess.
     * @param {Researcher}  researcher  The Researcher object containing all available researches.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _keywordInSlug: any;
    /**
     * Determines the score and the result text based on whether or not there's a keyword in the slug.
     *
     *
     * @returns {Object} The object with calculated score and resultText.
     */
    calculateResult(): Object;
}
/**
 * This assessment checks if the keyword is present in the slug.
 * UrlKeywordAssessment was the previous name for SlugKeywordAssessment (hence the name of this file).
 * We keep (and expose) this assessment for backwards compatibility.
 *
 * @deprecated Since version 1.19.1. Use SlugKeywordAssessment instead.
 */
export class UrlKeywordAssessment extends SlugKeywordAssessment {
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
