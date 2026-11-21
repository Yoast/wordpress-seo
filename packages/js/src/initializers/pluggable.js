import { dispatch } from "@wordpress/data";
import Pluggable from "../lib/Pluggable";

// Holds the singleton used in getPluggable.
let pluggable = null;

/**
 * Returns the pluggable instance.
 *
 * @returns {Pluggable} Pluggable.
 */
const getPluggable = () => {
	if ( pluggable === null ) {
		// Uses the initialized Pluggable plugin in `post-scraper.js` or `term-scraper.js` if available. If not, initiates a new Pluggable plugin.
		const refresh = dispatch( "yoast-seo/editor" ).runAnalysis;
		pluggable = window.YoastSEO.app && window.YoastSEO.app.pluggable
			? window.YoastSEO.app.pluggable
			: new Pluggable( refresh );
	}

	return pluggable;
};

/**
 * Declares a plugin "ready".
 *
 * Use this if you need to preload data asynchronously.
 *
 * @param {string} pluginName The name of the plugin to be declared as ready.
 *
 * @returns {boolean} Whether or not the plugin was successfully declared ready.
 */
export const pluginReady = pluginName => getPluggable()._ready( pluginName );

/**
 * Declares a plugin has been reloaded.
 *
 * If an analysis is currently running. We will reset it to ensure running
 * the latest modifications.
 *
 * @param {string} pluginName The name of the plugin to be declared as reloaded.
 *
 * @returns {boolean} Whether or not the plugin was successfully declared as
 *                    reloaded.
 */
export const pluginReloaded = pluginName => getPluggable()._reloaded( pluginName );

/**
 * Registers a callable for a specific data filter supported by YoastSEO.
 *
 * Can only be performed for plugins that have finished loading.
 *
 * @param {string}   modification The name of the filter.
 * @param {Function} callable     The callable.
 * @param {string}   pluginName   The plugin that is registering the modification.
 * @param {number}   [priority]   Used to specify the order in which the callables associated with a particular
 *                                filter are called. Lower numbers correspond with earlier execution.
 *
 * @returns {boolean} Whether or not applying the hook was successful.
 */
export const registerModification = ( modification, callable, pluginName, priority ) => {
	return getPluggable()._registerModification(  modification, callable, pluginName, priority );
};

/**
 * Registers a plugin with YoastSEO.
 *
 * A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param {string} pluginName     The name of the plugin to be registered.
 * @param {object} options        The options passed by the plugin.
 * @param {string} options.status The status of the plugin being registered. Can either be "loading" or "ready".
 *
 * @returns {boolean} Whether or not the plugin was successfully registered.
 */
export const registerPlugin = ( pluginName, options ) => getPluggable()._registerPlugin( pluginName, options );

/**
 * Calls the callables added to a modification hook.
 *
 * See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param {string} modification The name of the filter.
 * @param {*}      data         The data to filter.
 * @param {Object} [context]    Object for passing context parameters to the callable.
 *
 * @returns {*} The filtered data.
 */
export const applyModifications = ( modification, data, context ) => {
	if ( ! getPluggable().loaded ) {
		return data;
	}

	return getPluggable()._applyModifications( modification, data, context );
};
