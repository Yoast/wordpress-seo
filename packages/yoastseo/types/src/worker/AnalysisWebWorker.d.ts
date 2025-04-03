/**
 * Analysis Web Worker.
 *
 * Worker API:     https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * Webpack loader: https://github.com/webpack-contrib/worker-loader
 */
export default class AnalysisWebWorker {
    /**
     * Checks which assessors should update giving a configuration.
     *
     * @param {Object} configuration The configuration to check.
     * @param {ContentAssessor|null} [contentAssessor=null] The content assessor.
     * @param {SEOAssessor|null} [seoAssessor=null] The SEO assessor.
     * @param {InclusiveLanguageAssessor|null} [inclusiveLanguageAssessor=null] The inclusive language assessor.
     *
     * @returns {{seo: boolean, readability: boolean, inclusiveLanguage: boolean}} Whether each assessor should update.
     */
    static shouldAssessorsUpdate(configuration: Object, contentAssessor?: ContentAssessor | null | undefined, seoAssessor?: SEOAssessor | null | undefined, inclusiveLanguageAssessor?: InclusiveLanguageAssessor | null | undefined): {
        seo: boolean;
        readability: boolean;
        inclusiveLanguage: boolean;
    };
    /**
     * Initializes the AnalysisWebWorker class.
     *
     * @param {Object}      scope       The scope for the messaging. Expected to have the
     *                                  `onmessage` event and the `postMessage` function.
     * @param {Researcher}  researcher  The researcher to use.
     */
    constructor(scope: Object, researcher: Researcher);
    _scope: Object;
    _configuration: {
        contentAnalysisActive: boolean;
        keywordAnalysisActive: boolean;
        inclusiveLanguageAnalysisActive: boolean;
        useCornerstone: boolean;
        useTaxonomy: boolean;
        locale: string;
        customAnalysisType: string;
    };
    _scheduler: Scheduler;
    _paper: any;
    _relatedKeywords: {};
    _researcher: Researcher;
    _contentAssessor: ContentAssessor | null;
    _seoAssessor: SEOAssessor | null;
    _relatedKeywordAssessor: RelatedKeywordAssessor | null;
    additionalAssessors: {};
    _inclusiveLanguageOptions: {};
    _results: {
        readability: {
            results: never[];
            score: number;
        };
        seo: {
            "": {
                results: never[];
                score: number;
            };
        };
        inclusiveLanguage: {
            results: never[];
            score: number;
        };
    };
    _registeredAssessments: any[];
    _registeredMessageHandlers: {};
    _registeredParsers: any[];
    _CustomSEOAssessorClasses: {};
    _CustomCornerstoneSEOAssessorClasses: {};
    _CustomContentAssessorClasses: {};
    _CustomCornerstoneContentAssessorClasses: {};
    _CustomRelatedKeywordAssessorClasses: {};
    _CustomCornerstoneRelatedKeywordAssessorClasses: {};
    _CustomSEOAssessorOptions: {};
    _CustomCornerstoneSEOAssessorOptions: {};
    _CustomContentAssessorOptions: {};
    _CustomCornerstoneContentAssessorOptions: {};
    _CustomRelatedKeywordAssessorOptions: {};
    _CustomCornerstoneRelatedKeywordAssessorOptions: {};
    /**
     * Assesses the SEO of a paper on the given related keyphrases and their synonyms.
     *
     * The old assessor is used and their results are combined.
     *
     * @param {Paper}                 paper           The paper to analyze.
     * @param {Object}                relatedKeywords The related keyphrases to use in the analysis.
     *
     * @returns {Promise<[{results: {score: number, results: AssessmentResult[]}, key: string}]>} The results, one for each keyphrase.
     */
    assessRelatedKeywords(paper: Paper, relatedKeywords: Object): Promise<[{
        results: {
            score: number;
            results: AssessmentResult[];
        };
        key: string;
    }]>;
    /**
     * Register an assessment for a specific plugin.
     *
     * @param {string}   name       The name of the assessment.
     * @param {Assessment} assessment The assessment to add.
     * @param {string}   pluginName The name of the plugin associated with the assessment.
     * @param {string}   type       The type of the assessment. The default type is "seo".
     *
     * @returns {boolean} Whether registering the assessment was successful.
     */
    registerAssessment(name: string, assessment: Assessment, pluginName: string, type?: string): boolean;
    /**
     * Register a message handler for a specific plugin.
     *
     * @param {string}   name       The name of the message handler.
     * @param {function} handler    The function to run as a message handler.
     * @param {string}   pluginName The name of the plugin associated with the message handler.
     *
     * @returns {boolean} Whether registering the message handler was successful.
     */
    registerMessageHandler(name: string, handler: Function, pluginName: string): boolean;
    /**
     * Refreshes an assessment in the analysis.
     *
     * Custom assessments can use this to mark their assessment as needing a
     * refresh.
     *
     * @param {string} name The name of the assessment.
     * @param {string} pluginName The name of the plugin associated with the assessment.
     *
     * @returns {boolean} Whether refreshing the assessment was successful.
     */
    refreshAssessment(name: string, pluginName: string): boolean;
    /**
     * Sets a custom content assessor class.
     *
     * @param {ContentAssessor}  ContentAssessorClass     A content assessor class.
     * @param {string} customAnalysisType       The type of analysis.
     * @param {Object} customAssessorOptions    The options to use.
     *
     * @returns {void}
     */
    setCustomContentAssessorClass(ContentAssessorClass: ContentAssessor, customAnalysisType: string, customAssessorOptions: Object): void;
    /**
     * Sets a custom cornerstone content assessor class.
     *
     * @param {CornerstoneContentAssessor}  CornerstoneContentAssessorClass  A cornerstone content assessor class.
     * @param {string} customAnalysisType               The type of analysis.
     * @param {Object} customAssessorOptions            The options to use.
     *
     * @returns {void}
     */
    setCustomCornerstoneContentAssessorClass(CornerstoneContentAssessorClass: CornerstoneContentAssessor, customAnalysisType: string, customAssessorOptions: Object): void;
    /**
     * Sets a custom SEO assessor class.
     *
     * @param {SEOAssessor}   SEOAssessorClass   An SEO assessor class.
     * @param {string}  customAnalysisType       The type of analysis.
     * @param {Object}  customAssessorOptions    The options to use.
     *
     * @returns {void}
     */
    setCustomSEOAssessorClass(SEOAssessorClass: SEOAssessor, customAnalysisType: string, customAssessorOptions: Object): void;
    /**
     * Sets a custom cornerstone SEO assessor class.
     *
     * @param {CornerstoneSEOAssessor}   CornerstoneSEOAssessorClass  A cornerstone SEO assessor class.
     * @param {string}  customAnalysisType           The type of analysis.
     * @param {Object}  customAssessorOptions        The options to use.
     *
     * @returns {void}
     */
    setCustomCornerstoneSEOAssessorClass(CornerstoneSEOAssessorClass: CornerstoneSEOAssessor, customAnalysisType: string, customAssessorOptions: Object): void;
    /**
     * Sets a custom related keyword assessor class.
     *
     * @param {RelatedKeywordAssessor}   RelatedKeywordAssessorClass A related keyword assessor class.
     * @param {string}  customAnalysisType          The type of analysis.
     * @param {Object}  customAssessorOptions       The options to use.
     *
     * @returns {void}
     */
    setCustomRelatedKeywordAssessorClass(RelatedKeywordAssessorClass: RelatedKeywordAssessor, customAnalysisType: string, customAssessorOptions: Object): void;
    /**
     * Sets a custom cornerstone related keyword assessor class.
     *
     * @param {CornerstoneRelatedKeywordAssessor}   CornerstoneRelatedKeywordAssessorClass  A cornerstone related keyword assessor class.
     * @param {string}  customAnalysisType                      The type of analysis.
     * @param {Object}  customAssessorOptions                   The options to use.
     *
     * @returns {void}
     */
    setCustomCornerstoneRelatedKeywordAssessorClass(CornerstoneRelatedKeywordAssessorClass: CornerstoneRelatedKeywordAssessor, customAnalysisType: string, customAssessorOptions: Object): void;
    /**
     * Registers a custom assessor.
     *
     * @param {string} name The name of the assessor.
     * @param {Function} AssessorClass The assessor class to instantiate.
     * @param {Function} shouldUpdate Function that checks whether the assessor should update.
     *
     * @returns {void}
     */
    registerAssessor(name: string, AssessorClass: Function, shouldUpdate: Function): void;
    /**
     * Registers custom research to the researcher.
     *
     * @param {string} name         The name of the research.
     * @param {function} research   The research function to add.
     *
     * @returns {void}
     */
    registerResearch(name: string, research: Function): void;
    /**
     * Registers a custom helper to the researcher.
     *
     * @param {string} name       The name of the helper.
     * @param {function} helper   The helper function to add.
     *
     * @returns {void}
     */
    registerHelper(name: string, helper: Function): void;
    /**
     * Registers a configuration to the researcher.
     *
     * @param {string}  name                The name of the researcher configuration.
     * @param {*}       researcherConfig    The researcher configuration to add.
     *
     * @returns {void}
     */
    registerResearcherConfig(name: string, researcherConfig: any): void;
    /**
     * Sets the options to use for the Inclusive language analysis.
     *
     * @param {{infoLinks: {}}} options The options to use.
     *
     * @returns {void}
     */
    setInclusiveLanguageOptions(options: {
        infoLinks: {};
    }): void;
    /**
     * Receives the post message and determines the action.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
     *
     * @param {MessageEvent} event              The post message event.
     * @param {Object}       event.data         The data object.
     * @param {string}       event.data.type    The action type.
     * @param {string}       event.data.id      The request id.
     * @param {string}       event.data.payload The payload of the action.
     *
     * @returns {void}
     */
    handleMessage({ data: { type, id, payload } }: MessageEvent): void;
    analyzeRelatedKeywords: Function;
    /**
     * Runs analyses on a paper.
     *
     * The paper includes the keyword and synonyms data. However, this is
     * possibly just one instance of these. From here we are going to split up
     * this data and keep track of the different sets of keyword-synonyms and
     * their results.
     *
     * @param {number} id                        The request id.
     * @param {Object} payload                   The payload object.
     * @param {Paper} payload.paper              The paper to analyze.
     * @param {Object} [payload.relatedKeywords] The related keywords.
     *
     * @returns {Object} The result, may not contain readability or seo.
     */
    analyze(id: number, { paper, relatedKeywords }: {
        paper: Paper;
        relatedKeywords?: Object | undefined;
    }): Object;
    /**
     * Runs the specified research in the worker. Optionally pass a paper.
     *
     * @param {number} id     The request id.
     * @param {string} name   The name of the research to run.
     * @param {Paper} [paper] The paper to run the research on if it shouldn't
     *                        be run on the latest paper.
     *
     * @returns {Object} The result of the research.
     */
    runResearch(id: number, { name, paper }: string): Object;
    /**
     * Binds actions to this scope.
     *
     * @returns {void}
     */
    bindActions(): void;
    /**
     * Sends the analyze result back.
     *
     * @param {number} id     The request id.
     * @param {Object} result The result.
     *
     * @returns {void}
     */
    analyzeDone(id: number, result: Object): void;
    /**
     * Sends the analyze related keywords result back.
     *
     * @param {number} id     The request id.
     * @param {Object} result The result.
     *
     * @returns {void}
     */
    analyzeRelatedKeywordsDone(id: number, result: Object): void;
    /**
     * Loads a new script from an external source.
     *
     * @param {number} id  The request id.
     * @param {string} url The url of the script to load;
     *
     * @returns {Object} An object containing whether the url was loaded, the url and possibly an error message.
     */
    loadScript(id: number, { url }: string): Object;
    /**
     * Sends the load script result back.
     *
     * @param {number} id     The request id.
     * @param {Object} result The result.
     *
     * @returns {void}
     */
    loadScriptDone(id: number, result: Object): void;
    /**
     * Handle a custom message using the registered handler.
     *
     * @param {number} id   The request id.
     * @param {string} name The name of the message.
     * @param {Object} data The data of the message.
     *
     * @returns {Object} An object containing either success and data or an error.
     */
    customMessage(id: number, { name, data }: string): Object;
    /**
     * Send the result of a custom message back.
     *
     * @param {number} id     The request id.
     * @param {Object} result The result.
     *
     * @returns {void}
     */
    customMessageDone(id: number, result: Object): void;
    /**
     * Clears the worker cache to force a new analysis.
     *
     * @returns {void}
     */
    clearCache(): void;
    /**
     * Send the result of a custom message back.
     *
     * @param {number} id     The request id.
     * @param {Object} result The result.
     *
     * @returns {void}
     */
    runResearchDone(id: number, result: Object): void;
    /**
     * Registers this web worker with the scope passed to its constructor.
     *
     * @returns {void}
     */
    register(): void;
    /**
     * Initializes the appropriate content assessor.
     *
     * @returns {ContentAssessor|null} The chosen content assessor.
     */
    createContentAssessor(): ContentAssessor | null;
    /**
     * Initializes the appropriate SEO assessor.
     *
     * @returns {SEOAssessor|null} The chosen SEO assessor.
     */
    createSEOAssessor(): SEOAssessor | null;
    /**
     * Initializes the appropriate inclusive language assessor.
     *
     * @returns {InclusiveLanguageAssessor|null} The chosen inclusive language assessor.
     */
    createInclusiveLanguageAssessor(): InclusiveLanguageAssessor | null;
    /**
     * Initializes the appropriate SEO assessor for related keywords.
     *
     * @returns {RelatedKeywordAssessor|null} The chosen related keyword assessor.
     */
    createRelatedKeywordsAssessor(): RelatedKeywordAssessor | null;
    /**
     * Sends a message.
     *
     * @param {string} type      The message type.
     * @param {number} id        The request id.
     * @param {Object} [payload] The payload to deliver.
     *
     * @returns {void}
     */
    send(type: string, id: number, payload?: Object | undefined): void;
    /**
     * Configures the analysis worker.
     *
     * @param {number}   id                                     The request id.
     * @param {Object}   configuration                          The configuration object.
     * @param {boolean}  [configuration.contentAnalysisActive]  Whether the content analysis is active.
     * @param {boolean}  [configuration.keywordAnalysisActive]  Whether the keyword analysis is active.
     * @param {boolean}  [configuration.useCornerstone]         Whether the paper is cornerstone or not.
     * @param {boolean}  [configuration.useTaxonomy]            Whether the taxonomy assessor should be used.
     * @param {string}   [configuration.locale]                 The locale used in the seo assessor.
     * @param {Object}   [configuration.translations]           The translation strings.
     * @param {Object}   [configuration.researchData]           Extra research data.
     * @param {Object}   [configuration.defaultQueryParams]     The default query params for the Shortlinker.
     * @param {string}   [configuration.logLevel]               Log level, see: https://github.com/pimterry/loglevel#documentation
     * @param {string[]} [configuration.enabledFeatures]        A list of feature name flags of the experimental features to enable.
     *
     * @returns {void}
     */
    initialize(id: number, configuration: {
        contentAnalysisActive?: boolean | undefined;
        keywordAnalysisActive?: boolean | undefined;
        useCornerstone?: boolean | undefined;
        useTaxonomy?: boolean | undefined;
        locale?: string | undefined;
        translations?: Object | undefined;
        researchData?: Object | undefined;
        defaultQueryParams?: Object | undefined;
        logLevel?: string | undefined;
        enabledFeatures?: string[] | undefined;
    }): void;
    _inclusiveLanguageAssessor: InclusiveLanguageAssessor | null | undefined;
    /**
     * Changes the locale in the configuration.
     *
     * If the locale is different:
     * - Update the configuration locale.
     * - Create the content assessor.
     *
     * @param {string} locale The locale to set.
     *
     * @returns {void}
     */
    setLocale(locale: string): void;
    /**
     * Checks if the paper contains changes that are used for readability.
     *
     * @param {Paper} paper The paper to check against the cached paper.
     *
     * @returns {boolean} True if there are changes detected.
     */
    shouldReadabilityUpdate(paper: Paper): boolean;
    /**
     * Checks if the paper contains changes that are used for inclusive language analysis.
     *
     * @param {Paper} paper The paper to check against the cached paper.
     *
     * @returns {boolean} True if there are changes detected.
     */
    shouldInclusiveLanguageUpdate(paper: Paper): boolean;
    /**
     * Updates the results for the inclusive language assessor.
     *
     * @param {boolean} shouldInclusiveLanguageUpdate Whether the results of the inclusive language assessor should be updated.
     * @returns {void}
     */
    updateInclusiveLanguageAssessor(shouldInclusiveLanguageUpdate: boolean): void;
    /**
     * Checks if the related keyword contains changes that are used for seo.
     *
     * @param {string} key                     The identifier of the related keyword.
     * @param {Object} relatedKeyword          The related keyword object.
     * @param {string} relatedKeyword.keyword  The keyword.
     * @param {string} relatedKeyword.synonyms The synonyms.
     *
     * @returns {boolean} True if there are changes detected.
     */
    shouldSeoUpdate(key: string, { keyword, synonyms }: {
        keyword: string;
        synonyms: string;
    }): boolean;
    /**
     * Checks whether the additional assessor should be updated.
     *
     * @param {Paper} paper The paper to check.
     * @returns {Object} An object containing the information whether each additional assessor needs to be updated.
     */
    shouldAdditionalAssessorsUpdate(paper: Paper): Object;
    /**
     * Updates the results for the additional assessor.
     *
     * @param {Object} shouldCustomAssessorsUpdate Whether the results of the additional assessor should be updated.
     * @returns {void}
     */
    updateAdditionalAssessors(shouldCustomAssessorsUpdate: Object): void;
    /**
     * Assesses a given paper
     * using an original Assessor (that works on a string representation of the text).
     *
     * The results of both analyses are combined using the given score aggregator.
     *
     * @param {Paper}                      paper The paper to analyze.
     * @param {Assessor}                   assessor     The original assessor.
     *
     * @returns {Promise<{score: number, results: AssessmentResult[]}>} The analysis results.
     */
    assess(paper: Paper, assessor: Assessor): Promise<{
        score: number;
        results: AssessmentResult[];
    }>;
}
import Scheduler from "./scheduler";
import ContentAssessor from "../scoring/assessors/contentAssessor.js";
import SEOAssessor from "../scoring/assessors/seoAssessor.js";
import RelatedKeywordAssessor from "../scoring/assessors/relatedKeywordAssessor.js";
import Paper from "../values/Paper.js";
import CornerstoneContentAssessor from "../scoring/assessors/cornerstone/contentAssessor.js";
import CornerstoneSEOAssessor from "../scoring/assessors/cornerstone/seoAssessor.js";
import CornerstoneRelatedKeywordAssessor from "../scoring/assessors/cornerstone/relatedKeywordAssessor.js";
import InclusiveLanguageAssessor from "../scoring/assessors/inclusiveLanguageAssessor.js";
