export default TreeAssessor;
/**
 * Analyzes a paper by doing a list of assessments on a tree representation of a text and its metadata.
 * Aggregates the scores on each individual assessment into an overall score.
 *
 * This score can represent anything from the readability to the SEO of the given text and metadata.
 *
 * @memberOf module:parsedPaper/assess
 */
declare class TreeAssessor {
    /**
     * Creates a new assessor.
     *
     * @param {Object}                                     options                 Assessor options.
     * @param {module:parsedPaper/research.TreeResearcher} options.researcher      Supplies the assessments with researches and their
     *                                                                             (cached) results.
     * @param {module:parsedPaper/assess.ScoreAggregator}  options.scoreAggregator Aggregates the scores on the individual assessments into one.
     * @param {module:parsedPaper/assess.Assessment[]}     [options.assessments]   The list of assessments to apply.
     */
    constructor(options: {
        researcher: any;
        scoreAggregator: any;
        assessments?: any;
    });
    /**
     * Supplies the assessments with researches and their (cached) results.
     * @type {module:parsedPaper/research.TreeResearcher}
     */
    researcher: any;
    /**
     * Aggregates the scores on the individual assessments into one overall score.
     * @type {module:parsedPaper/assess.ScoreAggregator}
     */
    scoreAggregator: any;
    /**
     * The list of assessments to apply.
     * @type {module:parsedPaper/assess.Assessment[]}
     */
    _assessments: any;
    /**
     * Returns the list of available assessments.
     *
     * @returns {module:parsedPaper/assess.Assessment[]} The list of all available assessments.
     */
    getAssessments(): any;
    /**
     * Assesses the given text by applying all the assessments to it
     * and aggregating the resulting scores.
     *
     * @param {Paper}                      paper The paper to assess. This contains metadata about the text.
     * @param {module:parsedPaper/structure.Node} node  The root node of the tree to check.
     *
     * @returns {Promise<{results: AssessmentResult[], score: number}>} The assessment results and the overall score.
     */
    assess(paper: Paper, node: any): Promise<{
        results: AssessmentResult[];
        score: number;
    }>;
    /**
     * Applies the given assessment to the paper-node combination.
     *
     * @param {module:parsedPaper/assess.Assessment} assessment The assessment to apply.
     * @param {Paper}                         paper      The paper to apply the assessment to.
     * @param {module:parsedPaper/structure.Node}    node       The root node of the tree to apply the assessment to.
     *
     * @returns {Promise<AssessmentResult>} The result of the assessment.
     */
    applyAssessment(assessment: any, paper: Paper, node: any): Promise<AssessmentResult>;
    /**
     * Adds the assessment to the list of assessments to apply.
     *
     * @param {string}                        name       The name to register the assessment under.
     * @param {module:parsedPaper/assess.Assessment} assessment The assessment to add.
     *
     * @returns {void}
     */
    registerAssessment(name: string, assessment: any): void;
    /**
     * Removes the assessment registered under the given name, if it exists.
     *
     * @param {string} name The name of the assessment to remove.
     *
     * @returns {module:parsedPaper/assess.Assessment|null} The deleted assessment, or null if no assessment has been deleted.
     */
    removeAssessment(name: string): any;
    /**
     * Returns the assessment registered under the given name.
     * Returns `null` if no assessment is registered under the given name.
     *
     * @param {string} name The name of the assessment to get.
     *
     * @returns {Assessment|null} The assessment.
     */
    getAssessment(name: string): Assessment | null;
    /**
     * Sets the assessments that this assessor needs to apply.
     *
     * @param {module:parsedPaper/assess.Assessment[]} assessments The assessments to set.
     *
     * @returns {void}
     */
    setAssessments(assessments: any): void;
    /**
     * Returns the list of applicable assessments.
     *
     * @param {Paper}                      paper The paper to check.
     * @param {module:parsedPaper/structure.Node} node  The tree to check.
     *
     * @returns {Promise<Array>} The list of applicable assessments.
     */
    getApplicableAssessments(paper: Paper, node: any): Promise<any[]>;
}
import AssessmentResult from "../../values/AssessmentResult";
