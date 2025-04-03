export default SubheadingsDistributionTooLong;
export type SubheadingText = import("../../../languageProcessing/researches/getSubheadingTextLengths").SubheadingText;
/**
 * The default configuration for the subheading distribution assessment.
 */
export type SubheadingDistributionConfig = {
    /**
     * The parameters for the assessment.
     */
    parameters: {
        recommendedMaximumLength: number;
        slightlyTooMany: number;
        farTooMany: number;
    };
    /**
     * The URL for the help article for subheading distribution assessment used in the assessment's feedback title.
     */
    urlTitle: string;
    /**
     * The URL for the help article for subheading distribution assessment used in the assessment's feedback call-to-action.
     */
    urlCallToAction: string;
    /**
     * The scores for the assessment.
     */
    scores: {
        goodShortTextNoSubheadings: number;
        goodSubheadings: number;
        okSubheadings: number;
        badSubheadings: number;
        badLongTextNoSubheadings: number;
    };
    /**
     * The minimum text length for the assessment to be applicable.
     */
    applicableIfTextLongerThan: number;
    /**
     * Whether the assessment should not appear in short texts.
     */
    shouldNotAppearInShortText: boolean;
    /**
     * Whether the text is cornerstone content.
     */
    cornerstoneContent: boolean;
    /**
     * Whether to count characters instead of words.
     */
    countCharacters: boolean;
};
/**
 * @typedef {import("../../../languageProcessing/researches/getSubheadingTextLengths").SubheadingText } SubheadingText
 */
/**
 * @typedef {Object} SubheadingDistributionConfig The default configuration for the subheading distribution assessment.
 * @property {Object} parameters The parameters for the assessment.
 * @property {number} parameters.recommendedMaximumLength The maximum recommended value of the subheading text.
 * @property {number} parameters.slightlyTooMany The slightly too many value of the subheading text.
 * @property {number} parameters.farTooMany The far too many value of the subheading text.
 * @property {string} urlTitle The URL for the help article for subheading distribution assessment used in the assessment's feedback title.
 * @property {string} urlCallToAction The URL for the help article for subheading distribution assessment used in the assessment's feedback call-to-action.
 * @property {Object} scores The scores for the assessment.
 * @property {number} scores.goodShortTextNoSubheadings The score for a good short text without subheadings.
 * @property {number} scores.goodSubheadings The score for good subheading distribution.
 * @property {number} scores.okSubheadings The score for okay subheading distribution.
 * @property {number} scores.badSubheadings The score for bad subheading distribution.
 * @property {number} scores.badLongTextNoSubheadings The score for a bad long text without subheadings.
 * @property {number} applicableIfTextLongerThan The minimum text length for the assessment to be applicable.
 * @property {boolean} shouldNotAppearInShortText Whether the assessment should not appear in short texts.
 * @property {boolean} cornerstoneContent Whether the text is cornerstone content.
 * @property {boolean} countCharacters Whether to count characters instead of words.
 */
/**
 * Represents the assessment that checks whether a text has a good distribution of subheadings.
 */
declare class SubheadingsDistributionTooLong extends Assessment {
    /**
     * Creates an instance of SubheadingsDistributionTooLong.
     * @constructor
     *
     * @param {Object} [config={}] The configuration to use. This configuration will be merged with the default configuration.
     */
    constructor(config?: Object | undefined);
    identifier: string;
    _config: SubheadingDistributionConfig & Object;
    /**
     * Checks if the text before the first subheading is long or very long.
     *
     * @param {SubheadingText[]} foundSubheadings  An array containing found subheading objects.
     *
     * @returns {{isVeryLong: boolean, isLong: boolean}} An object containing an information whether the text before the first subheading is long or very long.
     */
    checkTextBeforeFirstSubheadingLength(foundSubheadings: SubheadingText[]): {
        isVeryLong: boolean;
        isLong: boolean;
    };
    /**
     * Gets the text length from the paper. Remove unwanted element first before calculating.
     *
     * @param {Paper} paper The Paper object to analyse.
     * @param {Researcher} researcher The researcher to use.
     * @returns {number} The length of the text.
     */
    getTextLength(paper: Paper, researcher: Researcher): number;
    /**
     * Runs the getSubheadingTextLength research and checks scores based on length.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     * @param {Researcher}  researcher  The researcher used for calling research.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _subheadingTextsLength: any;
    _hasSubheadings: boolean | undefined;
    _tooLongTextsNumber: number | undefined;
    _textLength: number | undefined;
    /**
     * Checks if there is language-specific config, and if so, overwrite the current config with it.
     *
     * @param {Researcher} researcher The researcher to use.
     *
     * @returns {SubheadingDistributionConfig} The config that should be used.
     */
    getLanguageSpecificConfig(researcher: Researcher): SubheadingDistributionConfig;
    /**
     * Checks whether the paper has subheadings.
     *
     * @param {Paper} paper The paper to use for the assessment.
     *
     * @returns {boolean} True when there is at least one subheading.
     */
    hasSubheadings(paper: Paper): boolean;
    /**
     * Creates a marker for each subheading that precedes a text that is too long.
     *
     * @returns {Mark[]} All markers for the current text.
     */
    getMarks(): Mark[];
    /**
     * Counts the number of subheading texts that are too long.
     *
     * @returns {SubheadingText[]} The array containing subheading texts that are too long.
     */
    getTooLongSubheadingTexts(): SubheadingText[];
    /**
     * Returns the feedback texts for the assessment when there is a long text without subheadings.
     *
     * @returns {{beginning: (function(boolean): string), nonBeginning: (function(boolean): string)}} The feedback texts.
     */
    getFeedbackTexts(): {
        beginning: ((arg0: boolean) => string);
        nonBeginning: ((arg0: boolean) => string);
    };
    /**
     * Calculates the score and creates a feedback string based on the subheading texts length for a long text without subheadings.
     *
     * @param {{isVeryLong: boolean, isLong: boolean}} textBeforeFirstSubheading  An object containing information whether the text before the first subheading is long or very long.
     * @returns {{resultText: string, score: number, hasMarks: boolean}} The calculated result.
     */
    calculateResultForLongTextWithoutSubheadings(textBeforeFirstSubheading: {
        isVeryLong: boolean;
        isLong: boolean;
    }): {
        resultText: string;
        score: number;
        hasMarks: boolean;
    };
    /**
     * Calculates the score and creates a feedback string based on the subheading texts length.
     *
     * @param {{isVeryLong: boolean, isLong: boolean}} textBeforeFirstSubheading   An object containing information whether the text before the first subheading is long or very long.
     *
     * @returns {{resultText: string, score: number, hasMarks: boolean}} The calculated result.
     */
    calculateResult(textBeforeFirstSubheading: {
        isVeryLong: boolean;
        isLong: boolean;
    }): {
        resultText: string;
        score: number;
        hasMarks: boolean;
    };
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
