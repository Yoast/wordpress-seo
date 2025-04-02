/**
 * Represents the assessment that checks whether there are passive sentences in the text.
 */
export default class PassiveVoiceAssessment extends Assessment {
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
     * Calculates the result based on the number of sentences and passives.
     *
     * @param {object} passiveVoice     The object containing the number of sentences and passives.
     *
     * @returns {{score: number, text}} resultobject with score and text.
     */
    calculatePassiveVoiceResult(passiveVoice: object): {
        score: number;
        text: any;
    };
    /**
     * Marks all sentences that have the passive voice.
     *
     * @param {object} paper        The paper to use for the assessment.
     * @param {object} researcher   The researcher used for calling research.
     *
     * @returns {object} All marked sentences.
     */
    getMarks(paper: object, researcher: object): object;
    /**
     * Runs the passiveVoice module, based on this returns an assessment result with score and text.
     *
     * @param {object} paper        The paper to use for the assessment.
     * @param {object} researcher   The researcher used for calling research.
     *
     * @returns {object} the Assessmentresult
     */
    getResult(paper: object, researcher: object): object;
}
import Assessment from "../assessment";
