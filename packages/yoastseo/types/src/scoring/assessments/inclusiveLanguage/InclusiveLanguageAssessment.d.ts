/**
 * An inclusive language assessment.
 *
 * Based on the configuration given to it in the constructor, it assesses
 * whether a paper's text contains potentially non-inclusive phrases and
 * suggests a potentially more inclusive alternative.
 */
export default class InclusiveLanguageAssessment {
    /**
     * Creates a new inclusive language assessment.
     *
     * @param {object} config The assessment configuration.
     *
     * @param {string} config.identifier The identifier of this assessment.
     * @param {string[]} config.nonInclusivePhrases The non-inclusive phrases.
     * @param {string|array} config.inclusiveAlternatives The suggested alternative, more inclusive, phrase(s).
     * @param {number} config.score The score to give if the non-inclusive phrase is recognized in the text.
     * @param {string} config.feedbackFormat The feedback format string,
     * 									should include a `%1$s` placeholder for the non-inclusive phrase
     * 									and `%2$s` (and potentially further replacements) for the suggested alternative(s).
     * @param {string} config.learnMoreUrl The URL to an article explaining more about this specific assessment.
     * @param {function} [config.rule] A potential additional rule for targeting the non-inclusive phrases.
     * @param {string} [config.ruleDescription] A description of the rule.
     * @param {boolean} [config.caseSensitive=false] If the inclusive phrase is case-sensitive, defaults to `false`.
     * @param {string} [config.category] The category of the assessment.
     *
     * @returns {void}
     */
    constructor({ identifier, nonInclusivePhrases, inclusiveAlternatives, score, feedbackFormat, learnMoreUrl, rule, ruleDescription, caseSensitive, category }: {
        identifier: string;
        nonInclusivePhrases: string[];
        inclusiveAlternatives: string | array;
        score: number;
        feedbackFormat: string;
        learnMoreUrl: string;
        rule?: Function | undefined;
        ruleDescription?: string | undefined;
        caseSensitive?: boolean | undefined;
        category?: string | undefined;
    });
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: any;
    score: number;
    feedbackFormat: string;
    learnMoreUrl: string;
    rule: Function;
    ruleDescription: string | undefined;
    caseSensitive: boolean;
    category: string | undefined;
    /**
     * Checks whether the assessment is applicable for the given paper.
     *
     * @param {Paper} paper The paper to check.
     * @param {Researcher} researcher The researcher.
     *
     * @returns {boolean} Whether the assessment is applicable for the given paper.
     */
    isApplicable(paper: Paper, researcher: Researcher): boolean;
    foundPhrases: any[] | undefined;
    /**
     * Execute the Assessment and return a result.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */
    getResult(): AssessmentResult;
    /**
     * Marks text for the inclusive language assessment.
     *
     * @returns {Array<Mark>} A list of marks that should be applied.
     */
    getMarks(): Array<Mark>;
}
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
