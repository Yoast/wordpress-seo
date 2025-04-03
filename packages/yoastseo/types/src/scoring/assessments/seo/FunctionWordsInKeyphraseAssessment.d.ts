export default FunctionWordsInKeyphraseAssessment;
/**
 * Assessment to check whether the keyphrase only contains function words.
 */
declare class FunctionWordsInKeyphraseAssessment extends Assessment {
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
    constructor(config?: Object | undefined);
    identifier: string;
    _config: {
        scores: {
            onlyFunctionWords: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Runs the functionWordsInKeyphrase researcher, based on this returns an assessment result with score.
     *
     * @param {Paper} 		paper 		The paper to use for the assessment.
     * @param {Researcher} 	researcher 	The researcher used for calling research.
     *
     * @returns {AssessmentResult} The result of the assessment.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _functionWordsInKeyphrase: any;
    _keyword: string | undefined;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
