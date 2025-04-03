export default Assessment;
/**
 * An assessment that can be applied to a formatted text and its meta data.
 *
 * @memberOf module:parsedPaper/assess
 *
 * @abstract
 */
declare class Assessment {
    /**
     * Creates a new assessment.
     *
     * @param {string}                              name       The name to give this assessment.
     * @param {module:parsedPaper/research.TreeResearcher} researcher The researcher to do researches with.
     *
     * @abstract
     */
    constructor(name: string, researcher: any);
    /**
     * This assessment's name.
     * @type {string}
     */
    name: string;
    /**
     * The researcher to do researches with.
     * @type {module:parsedPaper/research.TreeResearcher}
     * @private
     */
    private _researcher;
    /**
     * Sets a new researcher on this assessment.
     *
     * @param {module:parsedPaper/research.TreeResearcher} researcher The researcher to do researches with.
     *
     * @returns {void}
     */
    setResearcher(researcher: any): void;
    /**
     * Returns the researcher used by this assessment.
     *
     * @returns {module:parsedPaper/research.TreeResearcher} The researcher used by this assessment.
     */
    getResearcher(): any;
    /**
     * Checks whether this assessment is applicable to the given paper and tree combination.
     *
     * @param {ParsedPaper} parsedPaper The parsedPaper to check.
     *
     * @returns {Promise<boolean>} Whether this assessment is applicable to the given paper and tree combination (wrapped in a promise).
     *
     * @abstract
     */
    isApplicable(parsedPaper: ParsedPaper): Promise<boolean>;
    /**
     * Applies this assessment to the given combination of parsedPaper and tree.
     *
     * @param {ParsedPaper} parsedPaper The parsedPaper to check.
     *
     * @returns {Promise<AssessmentResult>} The result of this assessment (wrapped in a promise).
     *
     * @abstract
     */
    apply(parsedPaper: ParsedPaper): Promise<AssessmentResult>;
}
