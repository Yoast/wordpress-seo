/**
 * The PreviouslyUsedKeyword plugin allows to check for previously used keywords.
 */
export default class PreviouslyUsedKeyword {
    /**
     * Constructs a new PreviouslyUsedKeyword plugin.
     *
     * @param {object} app The app.
     * @param {object} args An arguments object.
     * @param {object} args.usedKeywords An object with keywords and ids where they are used.
     * @param {object} args.usedKeywordsPostTypes An object with the post types of the post ids from usedKeywords.
     * @param {string} args.searchUrl The url used to link to a search page when multiple usages of the keyword are found.
     * @param {string} args.postUrl The url used to link to a post when 1 usage of the keyword is found.
     *
     * @constructor
     */
    constructor(app: object, args: {
        usedKeywords: object;
        usedKeywordsPostTypes: object;
        searchUrl: string;
        postUrl: string;
    });
    app: object;
    usedKeywords: object;
    usedKeywordsPostTypes: object;
    searchUrl: string;
    postUrl: string;
    urlTitle: string;
    urlCallToAction: string;
    /**
     * Registers the assessment with the assessor.
     *
     * @returns {void}
     */
    registerPlugin(): void;
    /**
     * Updates the usedKeywords.
     *
     * @param {object} usedKeywords An object with keywords and ids where they are used.
     * @param {object} usedKeywordsPostTypes An object with keywords and in which post types they are used.
     * The post types correspond with the ids in the usedKeywords parameter.
     * @returns {void}
     */
    updateKeywordUsage(usedKeywords: object, usedKeywordsPostTypes: object): void;
    /**
     * Scores the previously used keyword assessment based on the count.
     *
     * @param {object} previouslyUsedKeywords The result of the previously used keywords research
     * @param {Paper} paper The paper object to research.
     * @returns {{text: string, score: number}} The result object with a feedback text and a score.
     */
    scoreAssessment(previouslyUsedKeywords: object, paper: Paper): {
        text: string;
        score: number;
    };
    /**
     * Researches the previously used keywords, based on the used keywords and the keyword in the paper.
     *
     * @param {Paper} paper The paper object to research.
     * @returns {{id: number, count: number}} The object with the count and the id of the previously used keyword
     */
    researchPreviouslyUsedKeywords(paper: Paper): {
        id: number;
        count: number;
    };
    /**
     * Executes the assessment that checks whether a text uses previously used keywords.
     *
     * @param {Paper} paper The Paper object to assess.
     * @returns {AssessmentResult} The assessment result containing both a score and a descriptive text.
     */
    assess(paper: Paper): AssessmentResult;
}
import AssessmentResult from "../values/AssessmentResult.js";
