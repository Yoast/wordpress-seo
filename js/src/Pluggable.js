const forEach = require( "lodash/forEach" );
const isArray = require( "lodash/isArray" );
const isFunction = require( "lodash/isFunction" );
const isNumber = require( "lodash/isNumber" );
const isObject = require( "lodash/isObject" );
const isString = require( "lodash/isString" );
const isUndefined = require( "lodash/isUndefined" );
const reduce = require( "lodash/reduce" );

/**
 * The plugins object takes care of plugin registrations, preloading and managing data modifications.
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
	 * @param {Function} refresh The function that refreshes the analyses.
	 *
	 * @property {boolean} loaded           Whether the plugins are loaded.
	 * @property {number}  preloadThreshold The maximum time plugins are allowed
	 *                                      to preload before we load our
	 *                                      content analysis.
	 * @property {Object}  plugins          The plugins that have been
	 *                                      registered.
	 * @property {Object}  modifications    The modifications that have been
	 *                                      registered. Every modification
	 *                                      contains an array with callables.
	 */
	constructor( refresh ) {
		this.refresh = refresh;
		this.loaded = false;
		this.preloadThreshold = 3000;
		this.plugins = {};
		this.modifications = {};

		this._registerPlugin = this._registerPlugin.bind( this );
		this._ready = this._ready.bind( this );
		this._reloaded = this._reloaded.bind( this );
		this._registerModification = this._registerModification.bind( this );
		this._registerAssessment = this._registerAssessment.bind( this );
		this._applyModifications = this._applyModifications.bind( this );

		// Allow plugins 1500 ms to register before we start polling them.
		setTimeout( this._pollLoadingPlugins.bind( this ), 1500 );
	}

	/**
	 * Register a plugin with YoastSEO.
	 *
	 * A plugin can be declared "ready" right at registration or later
	 * using `this.ready`.
	 *
	 * @param {string} pluginName     The name of the plugin to be registered.
	 * @param {object} options        The options passed by the plugin.
	 * @param {string} options.status The status of the plugin being registered.
	 *                                Can either be "loading" or "ready".
	 *
	 * @returns {boolean} Whether or not the plugin was successfully registered.
	 */
	_registerPlugin( pluginName, options ) {
		if ( ! isString( pluginName ) ) {
			console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
			return false;
		}

		if ( ! isUndefined( options ) && ! isObject( options ) ) {
			console.error( "Failed to register plugin " + pluginName + ". Expected parameters `options` to be a object." );
			return false;
		}

		if ( this._validateUniqueness( pluginName ) === false ) {
			console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
			return false;
		}

		this.plugins[ pluginName ] = options;

		return true;
	}

	/**
	 * Declare a plugin "ready".
	 *
	 * Use this if you need to preload data with AJAX.
	 *
	 * @param {string} pluginName The name of the plugin to be declared as
	 *                            ready.
	 *
	 * @returns {boolean} Whether or not the plugin was successfully declared
	 *                    ready.
	 */
	_ready( pluginName ) {
		if ( ! isString( pluginName ) ) {
			console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
			return false;
		}

		if ( isUndefined( this.plugins[ pluginName ] ) ) {
			console.error( "Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered." );
			return false;
		}

		this.plugins[ pluginName ].status = "ready";

		return true;
	}

	/**
	 * Declares a plugin has been reloaded.
	 *
	 * If an analysis is currently running. We will reset it to ensure running
	 * the latest modifications.
	 *
	 * @param {string} pluginName The name of the plugin to be declared as
	 *                            reloaded.
	 *
	 * @returns {boolean} Whether or not the plugin was successfully declared as
	 *                    reloaded.
	 */
	_reloaded( pluginName ) {
		if ( ! isString( pluginName ) ) {
			console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
			return false;
		}

		if ( isUndefined( this.plugins[ pluginName ] ) ) {
			console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
			return false;
		}

		this.refresh();
		return true;
	}

	/**
	 * Registers a callable for a specific data filter supported by YoastSEO.
	 *
	 * Can only be performed for plugins that have finished loading.
	 *
	 * @param {string}   modification The name of the filter.
	 * @param {Function} callable     The callable.
	 * @param {string}   pluginName   The plugin that is registering the
	 *                                modification.
	 * @param {number}   [priority]   Used to specify the order in which the
	 *                                callables associated with a particular
	 *                                filter are called. Lower numbers
	 *                                correspond with earlier execution.
	 *
	 * @returns {boolean} Whether or not applying the hook was successful.
	 */
	_registerModification( modification, callable, pluginName, priority ) {
		if ( ! isString( modification ) ) {
			console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string." );
			return false;
		}
		if ( ! isFunction( callable ) ) {
			console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function." );
			return false;
		}
		if ( ! isString( pluginName ) ) {
			console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
			return false;
		}
		if ( this._validateOrigin( pluginName ) === false ) {
			console.error( "Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet." );
			return false;
		}

		// Default priority to 10.
		const prio = isNumber( priority ) ? priority : 10;
		const callableObject = {
			callable: callable,
			origin: pluginName,
			priority: prio,
		};

		// Make sure modification is defined on modifications object.
		if ( isUndefined( this.modifications[ modification ] ) ) {
			this.modifications[ modification ] = [];
		}
		this.modifications[ modification ].push( callableObject );

		return true;
	}

	/**
	 * Register an assessment for a specific plugin.
	 *
	 * @param {Object}   assessor   The assessor to add the assessments to.
	 * @param {string}   name       The name of the assessment.
	 * @param {Function} assessment The function to run as an assessment.
	 * @param {string}   pluginName The name of the plugin associated with the
	 *                              assessment.
	 *
	 * @returns {boolean} Whether registering the assessment was successful.
	 */
	_registerAssessment( assessor, name, assessment, pluginName ) {
		if ( ! isString( name ) ) {
			console.error( "Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string." );
			return false;
		}

		if ( ! isObject( assessment ) ) {
			console.error( "Failed to register assessment for plugin " + pluginName + ". Expected parameter `assessment` to be a function." );
			return false;
		}

		if ( ! isString( pluginName ) ) {
			console.error( "Failed to register assessment for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
			return false;
		}

		// Prefix the name with the pluginName so the test name is always unique.
		name = pluginName + "-" + name;

		assessor.addAssessment( name, assessment );

		return true;
	}

	/**
	 * Calls the callables added to a modification hook.
	 *
	 * See the YoastSEO.js Readme for a list of supported modification hooks.
	 *
	 * @param {string} modification The name of the filter.
	 * @param {*}      data         The data to filter.
	 * @param {Object} [context]    Object for passing context parameters to the
	 *                              callable.
	 *
	 * @returns {*} The filtered data.
	 */
	_applyModifications( modification, data, context ) {
		let callChain = this.modifications[ modification ];

		if ( ! isArray( callChain ) || callChain.length < 1 ) {
			return data;
		}

		callChain = this._stripIllegalModifications( callChain );
		callChain.sort( ( a, b ) => a.priority - b.priority );

		forEach( callChain, function( callableObject ) {
			const newData = callableObject.callable( data, context );
			if ( typeof newData !== typeof data ) {
				console.error(
					"Modification with name " + modification + " performed by plugin with name " +
					callableObject.origin + " was ignored because the data that was returned by it was of a different" +
					" type than the data we had passed it."
				);
				return;
			}
			data = newData;
		} );

		return data;
	}

	/**
	 * Poller to handle loading of plugins.
	 *
	 * Plugins can register with our app to let us know they are going to hook
	 * into our Javascript. They are allowed 5 seconds of pre-loading time to
	 * fetch all the data they need to be able to perform their data
	 * modifications. We will only apply data modifications from plugins that
	 * have declared ready within the pre-loading time in order to safeguard UX
	 * and data integrity.
	 *
	 * @param {number} [pollTime] The accumulated time to compare with the
	 *                            pre-load threshold.
	 *
	 * @returns {void}
	 */
	_pollLoadingPlugins( pollTime ) {
		pollTime = isUndefined( pollTime ) ? 0 : pollTime;
		if ( this._allReady() === true ) {
			this.loaded = true;
			this.refresh();
		} else if ( pollTime >= this.preloadThreshold ) {
			this._pollTimeExceeded();
			this.loaded = true;
			this.refresh();
		} else {
			pollTime += 50;
			setTimeout( this._pollLoadingPlugins.bind( this, pollTime ), 50 );
		}
	}

	/**
	 * Checks if all registered plugins have finished loading.
	 *
	 * @returns {boolean} Whether or not all registered plugins are loaded.
	 */
	_allReady() {
		return reduce( this.plugins, function( allReady, plugin ) {
			return allReady && plugin.status === "ready";
		}, true );
	}

	/**
	 * Removes the plugins that were not loaded within time.
	 *
	 * @returns {void}
	 */
	_pollTimeExceeded() {
		forEach( this.plugins, function( plugin, pluginName ) {
			if ( ! isUndefined( plugin.options ) && plugin.options.status !== "ready" ) {
				console.error( "Error: Plugin " + pluginName + ". did not finish loading in time." );
				delete this.plugins[ pluginName ];
			}
		} );
	}

	/**
	 * Checks the origin of the modifications from a callChain.
	 *
	 * @param {Array} callChain The callChain that contains items with possible
	 *                          invalid origins.
	 *
	 * @returns {Array} callChain The stripped version of the callChain.
	 */
	_stripIllegalModifications( callChain ) {
		forEach( callChain, ( callableObject, index ) => {
			if ( this._validateOrigin( callableObject.origin ) === false ) {
				delete callChain[ index ];
			}
		} );

		return callChain;
	}

	/**
	 * Checks if the plugin status is ready.
	 *
	 * Which means a modification has been registered and finished preloading.
	 *
	 * @param {string} pluginName The name of the plugin that needs to be
	 *                            validated.
	 *
	 * @returns {boolean} Whether or not the origin is valid.
	 */
	_validateOrigin( pluginName ) {
		return this.plugins[ pluginName ].status === "ready";
	}

	/**
	 * Validates if registered plugin has a unique name.
	 *
	 * @param {string} pluginName The name of the plugin that needs to be
	 *                            validated for uniqueness.
	 *
	 * @returns {boolean} Whether or not the plugin has a unique name.
	 */
	_validateUniqueness( pluginName ) {
		return isUndefined( this.plugins[ pluginName ] );
	}
}
