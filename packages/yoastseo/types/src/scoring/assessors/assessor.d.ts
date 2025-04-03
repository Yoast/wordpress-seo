export default Assessor;
/**
 * The Assessor is a base class for all assessors.
 */
declare class Assessor {
    /**
     * Creates a new Assessor instance.
     * @param {Researcher}	researcher	The researcher to use.
     * @param {Object}		[options]	The assessor options.
     */
    constructor(researcher: Researcher, options?: Object | undefined);
    type: string;
    /**
     * The list of assessments.
     * @type {Assessment[]}
     * @private
     */
    private _assessments;
    /**
     * The list of results.
     * @type {AssessmentResult[]}
     */
    results: AssessmentResult[];
    /**
     * The options.
     * @type {Object|{}}
     * @private
     */
    private _options;
    /**
     * The ScoreAggregator for this assessor.
     * @type {ScoreAggregator}
     * @private
     */
    private _scoreAggregator;
    /**
     * Checks if the researcher is defined and sets it.
     *
     * @param   {Researcher} researcher The researcher to use in the assessor.
     *
     * @throws  {MissingArgument} Parameter needs to be a valid researcher object.
     * @returns {void}
     */
    setResearcher(researcher: Researcher): void;
    _researcher: any;
    /**
     * Gets all available assessments.
     * @returns {Assessment[]} assessment
     */
    getAvailableAssessments(): Assessment[];
    /**
     * Checks whether the Assessment is applicable.
     *
     * @param {Assessment} assessment The Assessment object that needs to be checked.
     * @param {Paper} paper The Paper object to check against.
     * @param {Researcher} [researcher] The Researcher object containing additional information.
     * @returns {boolean} Whether or not the Assessment is applicable.
     */
    isApplicable(assessment: Assessment, paper: Paper, researcher?: any): boolean;
    /**
     * Determines whether an assessment has a marker.
     *
     * @param {Assessment} assessment The assessment to check for.
     * @returns {boolean} Whether or not the assessment has a marker.
     */
    hasMarker(assessment: Assessment): boolean;
    /**
     * Returns the specific marker for this assessor.
     *
     * @returns {Function} The specific marker for this assessor.
     */
    getSpecificMarker(): Function;
    /**
     * Returns the paper that was most recently assessed.
     *
     * @returns {Paper} The paper that was most recently assessed.
     */
    getPaper(): Paper;
    /**
     * Returns the marker for a given assessment, composes the specific marker with the assessment getMarks function.
     *
     * @param {Assessment} assessment The assessment for which we are retrieving the composed marker.
     * @param {Paper} paper The paper to retrieve the marker for.
     * @param {Researcher} researcher The researcher for the paper.
     * @returns {Function} A function that can mark the given paper according to the given assessment.
     */
    getMarker(assessment: Assessment, paper: Paper, researcher: Researcher): Function;
    /**
     * Runs the researches defined in the task list or the default researches.
     *
     * @param {Paper} paper The paper to run assessments on.
     * @returns {void}
     */
    assess(paper: Paper): void;
    _lastPaper: any;
    /**
     * Sets the value of has markers with a boolean to determine if there are markers.
     *
     * @param {boolean} hasMarkers True when there are markers, otherwise it is false.
     * @returns {void}
     */
    setHasMarkers(hasMarkers: boolean): void;
    _hasMarkers: boolean | undefined;
    /**
     * Returns true when there are markers.
     *
     * @returns {boolean} Are there markers
     */
    hasMarkers(): boolean;
    /**
     * Executes an assessment and returns the AssessmentResult.
     *
     * @param {Paper} paper The paper to pass to the assessment.
     * @param {Researcher} researcher The researcher to pass to the assessment.
     * @param {Assessment} assessment The assessment to execute.
     * @returns {AssessmentResult} The result of the assessment.
     */
    executeAssessment(paper: Paper, researcher: Researcher, assessment: Assessment): AssessmentResult;
    /**
     * Filters out all assessment results that have no score and no text.
     *
     * @returns {AssessmentResult[]} The array with all the valid assessments.
     */
    getValidResults(): AssessmentResult[];
    /**
     * Returns if an assessmentResult is valid.
     *
     * @param {AssessmentResult} assessmentResult The assessmentResult to validate.
     * @returns {boolean} whether or not the result is valid.
     */
    isValidResult(assessmentResult: AssessmentResult): boolean;
    /**
     * Returns the overall score. Calculates the total score by adding all scores and dividing these
     * by the number of results times the ScoreRating.
     *
     * @returns {number} The overall score.
     */
    calculateOverallScore(): number;
    /**
     * Registers an assessment and adds it to the internal assessments object.
     *
     * @param {string} name The name of the assessment.
     * @param {Assessment} assessment The object containing function to run as an assessment and it's requirements.
     * @returns {boolean} Whether registering the assessment was successful.
     */
    addAssessment(name: string, assessment: Assessment): boolean;
    /**
     * Removes a specific Assessment from the list of Assessments.
     *
     * @param {string} name The Assessment to remove from the list of assessments.
     * @returns {void}
     */
    removeAssessment(name: string): void;
    /**
     * Returns an assessment by identifier
     *
     * @param {string} identifier The identifier of the assessment.
     * @returns {Assessment} The object if found, otherwise undefined.
     */
    getAssessment(identifier: string): Assessment;
    /**
     * Checks which of the available assessments are applicable and returns an array with applicable assessments.
     *
     * @returns {Assessment[]} The array with applicable assessments.
     */
    getApplicableAssessments(): Assessment[];
    /**
     * Returns the ScoreAggregator for this assessor.
     *
     * @returns {ScoreAggregator} The specific marker for this assessor.
     */
    getScoreAggregator(): ScoreAggregator;
}
import AssessmentResult from "../../values/AssessmentResult.js";
