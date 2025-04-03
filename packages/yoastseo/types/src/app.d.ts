export default App;
export namespace YoastSEO {
    /**
     * ~getData
     */
    type App = () => Object;
}
/**
 * This should return an object with the given properties.
 *
 * @callback YoastSEO.App~getData
 * @returns {Object} data. The data object containing the following properties: keyword, meta, text, metaTitle, title, url, excerpt.
 * @returns {String} data.keyword The keyword that should be used.
 * @returns {String} data.meta The meta description to analyze.
 * @returns {String} data.text The text to analyze.
 * @returns {String} data.metaTitle The text in the HTML title tag.
 * @returns {String} data.title The title to analyze.
 * @returns {String} data.url The URL for the given page
 * @returns {String} data.excerpt Excerpt for the pages
 */
/**
 * @callback YoastSEO.App~getAnalyzerInput
 *
 * @returns {Array} An array containing the analyzer queue.
 */
/**
 * @callback YoastSEO.App~bindElementEvents
 *
 * @param {YoastSEO.App} app A reference to the YoastSEO.App from where this is called.
 */
/**
 * @callback YoastSEO.App~updateSnippetValues
 *
 * @param {Object} ev The event emitted from the DOM.
 */
/**
 * @callback YoastSEO.App~saveScores
 *
 * @param {int} score The overall keyword score as determined by the assessor.
 * @param {AssessorPresenter} assessorPresenter The assessor presenter that will be used to render the keyword score.
 */
/**
 * @callback YoastSEO.App~saveContentScore
 *
 * @param {int} score The overall content score as determined by the assessor.
 * @param {AssessorPresenter} assessorPresenter The assessor presenter that will be used to render the content score.
 */
/**
 * @callback YoastSEO.App~updatedContentResults
 *
 * @param {Object[]} result The updated content analysis results.
 * @param {number} result[].score The SEO score.
 * @param {string} result[].rating String representation of the SEO score.
 * @param {string} result[].text Textual explanation of the score.
 * @param {number} overallContentScore The overall content SEO score.
 */
/**
 * @callback YoastSEO.App~updatedKeywordsResults
 *
 * @param {Object[]} result The updated keywords analysis results.
 * @param {number} result[].score The SEO score.
 * @param {string} result[].rating String representation of the SEO score.
 * @param {string} result[].text Textual explanation of the score.
 * @param {number} overallContentScore The overall keywords SEO score.
 */
/**
 * Represents the main YoastSEO App.
 */
declare class App {
    /**
     * Loader for the analyzer, loads the eventbinder and the elementdefiner
     *
     * @param {Object} args The arguments passed to the loader.
     * @param {Object} args.translations Jed compatible translations.
     * @param {Object} args.targets Targets to retrieve or set on.
     * @param {String} args.targets.snippet ID for the snippet preview element.
     * @param {String} args.targets.output ID for the element to put the output of the analyzer in.
     * @param {int} args.typeDelay Number of milliseconds to wait between typing to refresh the analyzer output.
     * @param {boolean} args.dynamicDelay   Whether to enable dynamic delay, will ignore type delay if the analyzer takes a long time. Applicable on slow devices.
     * @param {int} args.maxTypeDelay The maximum amount of type delay even if dynamic delay is on.
     * @param {int} args.typeDelayStep The amount with which to increase the typeDelay on each step when dynamic delay is enabled.
     * @param {Object} args.callbacks The callbacks that the app requires.
     * @param {Object} args.assessor The Assessor to use instead of the default assessor.
     * @param {YoastSEO.App~getData} args.callbacks.getData Called to retrieve input data
     * @param {YoastSEO.App~getAnalyzerInput} args.callbacks.getAnalyzerInput Called to retrieve input for the analyzer.
     * @param {YoastSEO.App~bindElementEvents} args.callbacks.bindElementEvents Called to bind events to the DOM elements.
     * @param {YoastSEO.App~updateSnippetValues} args.callbacks.updateSnippetValues Called when the snippet values need to be updated.
     * @param {YoastSEO.App~saveScores} args.callbacks.saveScores Called when the score has been determined by the analyzer.
     * @param {YoastSEO.App~saveContentScore} args.callback.saveContentScore Called when the content score has been determined by the assessor.
     * @param {YoastSEO.App~updatedContentResults} args.callbacks.updatedContentResults Called when the score has been determined by the analyzer.
     * @param {YoastSEO.App~updatedKeywordsResults} args.callback.updatedKeywordsResults Called when the content score has been determined by the assessor.
     * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
     * @param {Function} args.marker The marker to use to apply the list of marks retrieved from an assessment.
     *
     * @param {boolean} [args.debouncedRefresh=true] Whether or not to debounce the refresh function. Defaults to true.
     * @param {Researcher} args.researcher The Researcher object to be used.
     *
     * @constructor
     */
    constructor(args: {
        translations: Object;
        targets: {
            snippet: string;
            output: string;
        };
        typeDelay: int;
        dynamicDelay: boolean;
        maxTypeDelay: int;
        typeDelayStep: int;
        callbacks: Object;
        assessor: Object;
    });
    config: {
        translations: Object;
        targets: {
            snippet: string;
            output: string;
        };
        typeDelay: int;
        dynamicDelay: boolean;
        maxTypeDelay: int;
        typeDelayStep: int;
        callbacks: Object;
        assessor: Object;
    };
    /**
     * Refreshes the analyzer and output of the analyzer, is debounced for a better experience.
     *
     * @returns {void}
     */
    refresh(): void;
    /**
     * Refreshes the analyzer and output of the analyzer, is throttled to prevent performance issues.
     *
     * @returns {void}
     *
     * @private
     */
    private _pureRefresh;
    callbacks: Object;
    researcher: any;
    pluggable: Pluggable;
    defaultOutputElement: string;
    _assessorOptions: {
        useCornerStone: boolean;
    };
    /**
     * Returns the default output element based on which analyses are active.
     *
     * @param {Object} args The arguments passed to the App.
     * @returns {string} The ID of the target that is active.
     */
    getDefaultOutputElement(args: Object): string;
    /**
     * Sets the assessors based on the assessor options and refreshes them.
     *
     * @param {Object} assessorOptions The specific options.
     * @returns {void}
     */
    changeAssessorOptions(assessorOptions: Object): void;
    seoAssessor: any;
    contentAssessor: any;
    /**
     * Returns an instance of the seo assessor to use.
     *
     * @returns {Assessor} The assessor instance.
     */
    getSeoAssessor(): Assessor;
    /**
     * Returns an instance of the content assessor to use.
     *
     * @returns {Assessor} The assessor instance.
     */
    getContentAssessor(): Assessor;
    /**
     * Initializes assessors based on whether the respective analysis is active.
     *
     * @param {Object} args The arguments passed to the App.
     * @returns {void}
     */
    initializeAssessors(args: Object): void;
    /**
     * Initializes the SEO assessor.
     *
     * @param {Object} args The arguments passed to the App.
     * @returns {void}
     */
    initializeSEOAssessor(args: Object): void;
    defaultSeoAssessor: SEOAssessor | undefined;
    cornerStoneSeoAssessor: CornerstoneSEOAssessor | undefined;
    /**
     * Initializes the content assessor.
     *
     * @param {Object} args The arguments passed to the App.
     * @returns {void}
     */
    initializeContentAssessor(args: Object): void;
    defaultContentAssessor: ContentAssessor | undefined;
    cornerStoneContentAssessor: CornerstoneContentAssessor | undefined;
    /**
     * Extends the config with defaults.
     *
     * @param {Object} args The arguments to be extended.
     *
     * @returns {Object} The extended arguments.
     */
    extendConfig(args: Object): Object;
    /**
     * Extends sample text config with defaults.
     *
     * @param {Object} sampleText The sample text to be extended.
     * @returns {Object} The extended sample text.
     */
    extendSampleText(sampleText: Object): Object;
    /**
     * Registers a custom data callback.
     *
     * @param {Function} callback The callback to register.
     *
     * @returns {void}
     */
    registerCustomDataCallback(callback: Function): void;
    /**
     * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
     *
     * @returns {void}
     */
    getData(): void;
    rawData: any;
    /**
     * Initializes the assessor presenters for content and SEO analysis.
     *
     * @returns {void}
     */
    initAssessorPresenters(): void;
    seoAssessorPresenter: AssessorPresenter | undefined;
    contentAssessorPresenter: AssessorPresenter | undefined;
    /**
     * Sets the startTime timestamp.
     *
     * @returns {void}
     */
    startTime(): void;
    startTimestamp: number | undefined;
    /**
     * Sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
     *
     * @returns {void}
     */
    endTime(): void;
    endTimestamp: number | undefined;
    /**
     * Inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter to format outputs.
     *
     * @returns {void}
     */
    runAnalyzer(): void;
    analyzerData: Object | undefined;
    paper: Paper | undefined;
    /**
     * Runs the keyword analysis and calls the appropriate callbacks.
     *
     * @returns {void}
     */
    runKeywordAnalysis(): void;
    /**
     * Runs the content analysis and calls the appropriate callbacks.
     *
     * @returns {void}
     */
    runContentAnalysis(): void;
    /**
     * Modifies the data with plugins before it is sent to the analyzer.
     *
     * @param   {Object}  data      The data to be modified.
     * @returns {Object}            The data with the applied modifications.
     */
    modifyData(data: Object): Object;
    /**
     * Removes the loading dialog and fires the analyzer when all plugins are loaded.
     *
     * @returns {void}
     */
    pluginsLoaded(): void;
    /**
     * Shows the loading dialog which shows the loading of the plugins.
     *
     * @returns {void}
     */
    showLoadingDialog(): void;
    /**
     * Updates the loading plugins. Uses the plugins as arguments to show which plugins are loading.
     *
     * @param   {Object}  plugins   The plugins to be parsed into the dialog.
     * @returns {void}
     */
    updateLoadingDialog(plugins: Object): void;
    /**
     * Removes the plugin load dialog.
     *
     * @returns {void}
     */
    removeLoadingDialog(): void;
    /**
     * Delegates to `YoastSEO.app.pluggable.registerPlugin`
     *
     * @param {string}  pluginName      The name of the plugin to be registered.
     * @param {object}  options         The options object.
     * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
     * @returns {boolean}               Whether or not it was successfully registered.
     */
    registerPlugin(pluginName: string, options: {
        status: string;
    }): boolean;
    /**
     * Delegates to `YoastSEO.app.pluggable.ready`
     *
     * @param {string}  pluginName  The name of the plugin to check.
     * @returns {boolean}           Whether or not the plugin is ready.
     */
    pluginReady(pluginName: string): boolean;
    /**
     * Delegates to `YoastSEO.app.pluggable.reloaded`
     *
     * @param {string} pluginName   The name of the plugin to reload
     * @returns {boolean}           Whether or not the plugin was reloaded.
     */
    pluginReloaded(pluginName: string): boolean;
    /**
     * Delegates to `YoastSEO.app.pluggable.registerModification`.
     *
     * @param {string}   modification   The name of the filter.
     * @param {function} callable       The callable function.
     * @param {string}   pluginName     The plugin that is registering the modification.
     * @param {number}   [priority]     Used to specify the order in which the callables associated with a particular filter are called.
     *                                  Lower numbers correspond with earlier execution.
     *
     * @returns {boolean} Whether or not the modification was successfully registered.
     */
    registerModification(modification: string, callable: Function, pluginName: string, priority?: number | undefined): boolean;
    /**
     * Registers a custom assessment for use in the analyzer, this will result in a new line in the analyzer results.
     * The function needs to use the assessment result to return a result based on the contents of the page/posts.
     *
     * Score 0 results in a grey circle if it is not explicitly set by using setscore
     * Scores 0, 1, 2, 3 and 4 result in a red circle
     * Scores 6 and 7 result in a yellow circle
     * Scores 8, 9 and 10 result in a green circle
     *
     * @param {string} name Name of the test.
     * @param {function} assessment The assessment to run.
     * @param {string}   pluginName The plugin that is registering the test.
     * @returns {boolean} Whether or not the test was successfully registered.
     */
    registerAssessment(name: string, assessment: Function, pluginName: string): boolean;
    /**
     * Disables markers visually in the UI.
     *
     * @returns {void}
     */
    disableMarkers(): void;
    /**
     * Renders the content and keyword analysis results.
     *
     * @returns {void}
     */
    _renderAnalysisResults(): void;
    /**
     * The analyzeTimer calls the checkInputs function with a delay, so the function won't be executed
     * at every keystroke checks the reference object, so this function can be called from anywhere,
     * without problems with different scopes.
     *
     * @deprecated: 1.3 - Use this.refresh() instead.
     *
     * @returns {void}
     */
    analyzeTimer(): void;
    /**
     * Registers a custom test for use in the analyzer, this will result in a new line in the analyzer results. The function
     * has to return a result based on the contents of the page/posts.
     *
     * The scoring object is a special object with definitions about how to translate a result from your analysis function
     * to a SEO score.
     *
     * Negative scores result in a red circle
     * Scores 1, 2, 3, 4 and 5 result in an orange circle
     * Scores 6 and 7 result in a yellow circle
     * Scores 8, 9 and 10 result in a red circle
     *
     * @returns {void}
     *
     * @deprecated since version 1.2
     */
    registerTest(): void;
    /**
     * Switches between the cornerstone and default assessors.
     *
     * @deprecated 1.35.0 - Use changeAssessorOption instead.
     *
     * @param {boolean} useCornerStone True when cornerstone should be used.
     *
     * @returns {void}
     */
    switchAssessors(useCornerStone: boolean): void;
}
import Pluggable from "./pluggable.js";
import SEOAssessor from "./scoring/assessors/seoAssessor.js";
import CornerstoneSEOAssessor from "./scoring/assessors/cornerstone/seoAssessor.js";
import ContentAssessor from "./scoring/assessors/contentAssessor.js";
import CornerstoneContentAssessor from "./scoring/assessors/cornerstone/contentAssessor.js";
import AssessorPresenter from "./scoring/renderers/AssessorPresenter.js";
import Paper from "./values/Paper.js";
