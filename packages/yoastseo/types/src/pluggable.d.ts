/**
 * The plugins object takes care of plugin registrations, preloading and managing data modifications.
 *
 * Please note that there is a newer copy of this plugin in `packages/js/src/lib/Pluggable.js`.
 * For internal use, please use the newer copy for all interfaces except for registering assessments.
 *
 * A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications.
 * In order to do so, it must first register itself as a plugin with YoastSEO.js. To keep our content analysis fast, we
 * don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify
 * the content. If plugins need to preload data, they can first register, then preload using AJAX and call `ready` once
 * preloaded.
 *
 * To minimize client side memory usage, we request plugins to preload as little data as possible. If you need to dynamically
 * fetch more data in the process of content creation, you can reload your data set and let YoastSEO.js know you've reloaded
 * by calling `reloaded`.
 */
export default class Pluggable {
    /**
     * Setup Pluggable and set its default values.
     *
     * @constructor
     * @param       {App}       app                 The App object to attach to.
     * @property    {number}    preloadThreshold	The maximum time plugins are allowed to preload before we load our content analysis.
     * @property    {object}    plugins             The plugins that have been registered.
     * @property    {object}    modifications 	    The modifications that have been registered. Every modification contains an array with callables.
     * @property    {Array}     customTests         All tests added by plugins.
     */
    constructor(app: App);
    app: App;
    loaded: boolean;
    preloadThreshold: number;
    plugins: {};
    modifications: {};
    customTests: any[];
    /**
     * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
     *
     * @param {string}  pluginName      The name of the plugin to be registered.
     * @param {object}  options         The options passed by the plugin.
     * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
     * @returns {boolean}               Whether or not the plugin was successfully registered.
     */
    _registerPlugin(pluginName: string, options: {
        status: string;
    }): boolean;
    /**
     * Declare a plugin "ready". Use this if you need to preload data with AJAX.
     *
     * @param {string} pluginName	The name of the plugin to be declared as ready.
     * @returns {boolean}           Whether or not the plugin was successfully declared ready.
     */
    _ready(pluginName: string): boolean;
    /**
     * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
     *
     * @param {string} pluginName   The name of the plugin to be declared as reloaded.
     * @returns {boolean}           Whether or not the plugin was successfully declared as reloaded.
     */
    _reloaded(pluginName: string): boolean;
    /**
     * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
     *
     * @param {string}      modification	The name of the filter
     * @param {function}    callable 	    The callable
     * @param {string}      pluginName 	    The plugin that is registering the modification.
     * @param {number}      priority	    (optional) Used to specify the order in which the callables associated with a particular filter are called.
     * 									    Lower numbers correspond with earlier execution.
     * @returns {boolean}                   Whether or not applying the hook was successful.
     */
    _registerModification(modification: string, callable: Function, pluginName: string, priority: number): boolean;
    /**
     * Register test for a specific plugin
     *
     * @returns {void}
     *
     * @deprecated
     */
    _registerTest(): void;
    /**
     * Register an assessment for a specific plugin
     *
     * @param {object} assessor The assessor object where the assessments needs to be added.
     * @param {string} name The name of the assessment.
     * @param {function} assessment The function to run as an assessment.
     * @param {string} pluginName The name of the plugin associated with the assessment.
     * @returns {boolean} Whether registering the assessment was successful.
     * @private
     */
    private _registerAssessment;
    /**
     * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
     * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
     * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
     *
     * @param   {number} pollTime (optional) The accumulated time to compare with the pre-load threshold.
     * @returns {void}
     * @private
     */
    private _pollLoadingPlugins;
    /**
     * Checks if all registered plugins have finished loading
     *
     * @returns {boolean} Whether or not all registered plugins are loaded.
     * @private
     */
    private _allReady;
    /**
     * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
     *
     * @returns {void}
     * @private
     */
    private _pollTimeExceeded;
    /**
     * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
     *
     * @param	{string}    modification	The name of the filter
     * @param   {*}         data 		    The data to filter
     * @param   {*}         context		    (optional) Object for passing context parameters to the callable.
     * @returns {*} 		                The filtered data
     * @private
     */
    private _applyModifications;
    /**
     * Adds new tests to the analyzer and it's scoring object.
     *
     * @param {Object} analyzer The analyzer object to add the tests to
     * @returns {void}
     * @private
     */
    private _addPluginTests;
    /**
     * Adds one new test to the analyzer and it's scoring object.
     *
     * @param {Object}            analyzer              The analyzer that the test will be added to.
     * @param {Object}            pluginTest            The test to be added.
     * @param {string}            pluginTest.name       The name of the test.
     * @param {function}          pluginTest.callable   The function associated with the test.
     * @param {function}          pluginTest.analysis   The function associated with the analyzer.
     * @param {Object}            pluginTest.scoring    The scoring object to be used.
     * @returns {void}
     * @private
     */
    private _addPluginTest;
    /**
     * Strips modifications from a callChain if they were not added with a valid origin.
     *
     * @param   {Array} callChain	 The callChain that contains items with possible invalid origins.
     * @returns {Array} callChain 	 The stripped version of the callChain.
     * @private
     */
    private _stripIllegalModifications;
    /**
     * Validates if origin of a modification has been registered and finished preloading.
     *
     * @param 	{string}    pluginName      The name of the plugin that needs to be validated.
     * @returns {boolean}                   Whether or not the origin is valid.
     * @private
     */
    private _validateOrigin;
    /**
     * Validates if registered plugin has a unique name.
     *
     * @param 	{string}    pluginName      The name of the plugin that needs to be validated for uniqueness.
     * @returns {boolean}                   Whether or not the plugin has a unique name.
     * @private
     */
    private _validateUniqueness;
}
