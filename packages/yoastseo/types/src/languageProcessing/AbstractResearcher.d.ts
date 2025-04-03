/**
 * The researcher contains all the researches, helpers, data, and config.
 */
export default class AbstractResearcher {
    /**
     * Constructor
     * @param {Paper} paper The Paper object that is needed within the researches.
     *
     * @constructor
     */
    constructor(paper: Paper);
    paper: Paper;
    defaultResearches: {
        altTagCount: typeof altTagCount;
        countSentencesFromText: typeof countSentencesFromText;
        findKeywordInFirstParagraph: typeof findKeywordInFirstParagraph;
        findKeyphraseInSEOTitle: (paper: Paper, researcher: Researcher) => KeyphraseInSEOTitleResult;
        findTransitionWords: typeof findTransitionWords;
        functionWordsInKeyphrase: typeof functionWordsInKeyphrase;
        getAnchorsWithKeyphrase: typeof getAnchorsWithKeyphrase;
        getFleschReadingScore: typeof getFleschReadingScore;
        getKeyphraseCount: typeof getKeyphraseCount;
        getKeyphraseDensity: typeof getKeyphraseDensity;
        getKeywordDensity: typeof getKeywordDensity;
        getLinks: typeof getLinks;
        getLinkStatistics: typeof getLinkStatistics;
        getParagraphs: typeof getParagraphs;
        getParagraphLength: typeof getParagraphLength;
        getProminentWordsForInsights: typeof getProminentWordsForInsights;
        getProminentWordsForInternalLinking: typeof getProminentWordsForInternalLinking;
        getSentenceBeginnings: (paper: import("./researches/getSentenceBeginnings").Paper, researcher: import("./researches/getSentenceBeginnings").Researcher) => import("./researches/getSentenceBeginnings").SentenceBeginning[];
        getSubheadingTextLengths: typeof getSubheadingTextLengths;
        h1s: typeof h1s;
        imageCount: typeof imageCount;
        keyphraseLength: typeof keyphraseLength;
        keywordCount: typeof keywordCount;
        keywordCountInSlug: typeof keywordCountInSlug;
        keywordCountInUrl: typeof keywordCountInUrl;
        matchKeywordInSubheadings: typeof matchKeywordInSubheadings;
        metaDescriptionKeyword: typeof metaDescriptionKeyword;
        metaDescriptionLength: typeof metaDescriptionLength;
        morphology: typeof morphology;
        pageTitleWidth: typeof pageTitleWidth;
        readingTime: typeof readingTime;
        sentences: typeof sentences;
        wordCountInText: typeof wordCountInText;
        videoCount: typeof videoCount;
        getPassiveVoiceResult: typeof getPassiveVoiceResult;
    };
    _data: {};
    customResearches: {};
    helpers: {
        memoizedTokenizer: ((text: string, trimSentences?: boolean | undefined) => Array<string>) & import("lodash").MemoizedFunction;
    };
    config: {
        areHyphensWordBoundaries: boolean;
    };
    /**
     * Set the Paper associated with the Researcher.
     *
     * @param {Paper} paper The Paper to use within the Researcher.
     *
     * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
     *
     * @returns {void}
     */
    setPaper(paper: Paper): void;
    /**
     * Add a custom research that will be available within the Researcher.
     *
     * @param {string}   name     A name to reference the research by.
     * @param {function} research The function to be added to the Researcher.
     *
     * @throws {MissingArgument}  Research name cannot be empty.
     * @throws {InvalidTypeError} The research requires a valid Function callback.
     *
     * @returns {void}
     */
    addResearch(name: string, research: Function): void;
    /**
     * Add research data to the researcher by the research name.
     *
     * @param {string} research The identifier of the research.
     * @param {Object} data     The data object.
     *
     * @returns {void}.
     */
    addResearchData(research: string, data: Object): void;
    /**
     * Add a custom helper that will be available within the Researcher.
     *
     * @param {string}   name     A name to reference the helper by.
     * @param {function} helper   The function to be added to the Researcher.
     *
     * @throws {MissingArgument}  Helper name cannot be empty.
     * @throws {InvalidTypeError} The helper requires a valid Function callback.
     *
     * @returns {void}
     */
    addHelper(name: string, helper: Function): void;
    /**
     * Add a custom configuration that will be available within the Researcher.
     *
     * @param {string}  name     A name to reference the helper by.
     * @param {*}       config   The configuration to be added to the Researcher.
     *
     * @throws {MissingArgument}  Configuration name and the configuration itself cannot be empty.
     *
     * @returns {void}
     */
    addConfig(name: string, config: any): void;
    /**
     * Check whether the research is known by the Researcher.
     *
     * @param {string} name The name to reference the research by.
     *
     * @returns {boolean} Whether or not the research is known by the Researcher.
     */
    hasResearch(name: string): boolean;
    /**
     * Check whether the helper is known by the Researcher.
     *
     * @param {string} name The name to reference the helper by.
     *
     * @returns {boolean} Whether or not the helper is known by the Researcher.
     */
    hasHelper(name: string): boolean;
    /**
     * Check whether the config is known by the Researcher.
     *
     * @param {string} name The name to reference the config by.
     *
     * @returns {boolean} Whether or not the config is known by the Researcher.
     */
    hasConfig(name: string): boolean;
    /**
     * Check whether the research data is known by the Researcher.
     *
     * @param {string} name The name to reference the research data by.
     *
     * @returns {boolean} Whether or not the research data is known by the Researcher.
     */
    hasResearchData(name: string): boolean;
    /**
     * Return all available researches.
     *
     * @returns {Object} An object containing all available researches.
     */
    getAvailableResearches(): Object;
    /**
     * Return all available helpers.
     *
     * @returns {Object} An object containing all available helpers.
     */
    getAvailableHelpers(): Object;
    /**
     * Return all available configuration.
     *
     * @returns {Object} An object containing all available configuration.
     */
    getAvailableConfig(): Object;
    /**
     * Return all available research data.
     *
     * @returns {Object} An object containing all available research data.
     */
    getAvailableResearchData(): Object;
    /**
     * Return the Research by name.
     *
     * @param {string} name The name to reference the research by.
     *
     * @returns {*} Returns the result of the research or false if research does not exist.
     *
     * @throws {MissingArgument} Research name cannot be empty.
     */
    getResearch(name: string): any;
    /**
     * Return the research data from a research data provider by research name.
     *
     * @param {string} research The identifier of the research.
     *
     * @returns {*} The data provided by the provider, false if the data do not exist
     */
    getData(research: string): any;
    /**
     * Return language specific configuration by configuration name.
     *
     * @param {string} name The name of the configuration.
     *
     * @returns {*} The configuration, false if the configuration does not exist.
     */
    getConfig(name: string): any;
    /**
     * Return language specific helper by helper name.
     *
     * @param {string} name The name of the helper.
     *
     * @returns {*} The helper, false if the helper does not exist.
     */
    getHelper(name: string): any;
}
import altTagCount from "./researches/altTagCount.js";
import countSentencesFromText from "./researches/countSentencesFromText.js";
import findKeywordInFirstParagraph from "./researches/findKeywordInFirstParagraph.js";
import findTransitionWords from "./researches/findTransitionWords";
import functionWordsInKeyphrase from "./researches/functionWordsInKeyphrase";
import getAnchorsWithKeyphrase from "./researches/getAnchorsWithKeyphrase";
import getFleschReadingScore from "./researches/getFleschReadingScore";
import getKeyphraseCount from "./researches/keywordCount";
import getKeyphraseDensity from "./researches/getKeywordDensity.js";
import { getKeywordDensity } from "./researches/getKeywordDensity.js";
import getLinks from "./researches/getLinks.js";
import getLinkStatistics from "./researches/getLinkStatistics";
import getParagraphs from "./researches/getParagraphs";
import getParagraphLength from "./researches/getParagraphLength.js";
import getProminentWordsForInsights from "./researches/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "./researches/getProminentWordsForInternalLinking";
import getSubheadingTextLengths from "./researches/getSubheadingTextLengths.js";
import h1s from "./researches/h1s";
import imageCount from "./researches/imageCount.js";
import keyphraseLength from "./researches/keyphraseLength";
import { keywordCount } from "./researches/keywordCount";
import { keywordCountInSlug } from "./researches/keywordCountInUrl";
import { keywordCountInUrl } from "./researches/keywordCountInUrl";
import matchKeywordInSubheadings from "./researches/matchKeywordInSubheadings";
import metaDescriptionKeyword from "./researches/metaDescriptionKeyword";
import metaDescriptionLength from "./researches/metaDescriptionLength.js";
import morphology from "./researches/getWordForms";
import pageTitleWidth from "./researches/pageTitleWidth.js";
import readingTime from "./researches/readingTime";
import sentences from "./researches/sentences";
import wordCountInText from "./researches/wordCountInText.js";
import videoCount from "./researches/videoCount";
import getPassiveVoiceResult from "./researches/getPassiveVoiceResult";
