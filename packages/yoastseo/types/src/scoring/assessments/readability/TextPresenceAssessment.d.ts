/**
 * Represents the assessment that checks whether there is enough text in the paper.
 */
export default class TextPresenceAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    constructor(config?: object);
    identifier: string;
    _config: {
        urlTitle: string;
        urlCallToAction: string;
    } & object;
    /**
     * Assesses that the paper has at least a little bit of content.
     *
     * @param {Paper} paper The paper to assess.
     *
     * @returns {AssessmentResult} The result of this assessment.
     */
    getResult(paper: Paper): AssessmentResult;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
