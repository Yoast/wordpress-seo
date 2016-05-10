/* global console: true */
/* global setTimeout: true */
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var reduce = require( "lodash/reduce" );
var isString = require( "lodash/isString" );
var isObject = require( "lodash/isObject" );
var InvalidTypeError = require( "./errors/invalidType" );

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
 *
 * @todo: add list of supported modifications and compare on registration of modification
 */

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
var Pluggable = function( app ) {
	this.app = app;
	this.loaded = false;
	this.preloadThreshold = 3000;
	this.plugins = {};
	this.modifications = {};
	this.customTests = [];

	// Allow plugins 1500 ms to register before we start polling their
	setTimeout( this._pollLoadingPlugins.bind( this ), 1500 );
};

//  ***** DSL IMPLEMENTATION ***** //

/**
 * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options passed by the plugin.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not the plugin was successfully registered.
 */
Pluggable.prototype._registerPlugin = function( pluginName, options ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( !isUndefined( options ) && typeof options !== "object" ) {
		console.error( "Failed to register plugin " + pluginName + ". Expected parameters `options` to be a object." );
		return false;
	}

	if ( this._validateUniqueness( pluginName ) === false ) {
		console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
		return false;
	}

	this.plugins[ pluginName ] = options;
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Declare a plugin "ready". Use this if you need to preload data with AJAX.
 *
 * @param {string} pluginName	The name of the plugin to be declared as ready.
 * @returns {boolean}           Whether or not the plugin was successfully declared ready.
 */
Pluggable.prototype._ready = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.plugins[ pluginName ].status = "ready";
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
 *
 * @param {string} pluginName   The name of the plugin to be declared as reloaded.
 * @returns {boolean}           Whether or not the plugin was successfully declared as reloaded.
 */
Pluggable.prototype._reloaded = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.app.refresh();
	return true;
};

/**
 * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
 *
 * @param {string}      modification	The name of the filter
 * @param {function}    callable 	    The callable
 * @param {string}      pluginName 	    The plugin that is registering the modification.
 * @param {number}      priority	    (optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									    Lower numbers correspond with earlier execution.
 * @returns {boolean}                   Whether or not applying the hook was successfull.
 */
Pluggable.prototype._registerModification = function( modification, callable, pluginName, priority ) {
	if ( typeof modification !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string." );
		return false;
	}

	if ( typeof callable !== "function" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function." );
		return false;
	}

	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	// Validate origin
	if ( this._validateOrigin( pluginName ) === false ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet." );
		return false;
	}

	// Default priority to 10
	var prio = typeof priority === "number" ?  priority : 10;

	var callableObject = {
		callable: callable,
		origin: pluginName,
		priority: prio
	};

	// Make sure modification is defined on modifications object
	if ( isUndefined( this.modifications[ modification ] ) ) {
		this.modifications[ modification ] = [];
	}

	this.modifications[ modification ].push( callableObject );

	return true;
};

/**
 * Register test for a specific plugin
 *
 * @deprecated
 */
Pluggable.prototype._registerTest = function() {
	console.error( "This function is deprecated, please use _registerAssessment" );
};

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
Pluggable.prototype._registerAssessment = function( assessor, name, assessment, pluginName ) {
	if ( !isString( name ) ) {
		throw new InvalidTypeError( "Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string." );
	}

	if ( !isObject( assessment ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `assessment` to be a function." );
	}

	if ( !isString( pluginName ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `pluginName` to be a string." );
	}

	// Prefix the name with the pluginName so the test name is always unique.
	name = pluginName + "-" + name;

	assessor.addAssessment( name, assessment );

	return true;
};

// ***** PRIVATE HANDLERS *****//

/**
 * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
 * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
 * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
 *
 * @param   {number} pollTime (optional) The accumulated time to compare with the pre-load threshold.
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollLoadingPlugins = function( pollTime ) {
	pollTime = isUndefined( pollTime ) ? 0 : pollTime;
	if ( this._allReady() === true ) {
		this.loaded = true;
		this.app.pluginsLoaded();
	} else if ( pollTime >= this.preloadThreshold ) {
		this._pollTimeExceeded();
	} else {
		pollTime += 50;
		setTimeout( this._pollLoadingPlugins.bind( this, pollTime ), 50 );
	}
};

/**
 * Checks if all registered plugins have finished loading
 *
 * @returns {boolean} Whether or not all registered plugins are loaded.
 * @private
 */
Pluggable.prototype._allReady = function() {
	return reduce( this.plugins, function( allReady, plugin ) {
		return allReady && plugin.status === "ready";
	}, true );
};

/**
 * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
 *
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollTimeExceeded = function() {
	forEach( this.plugins, function( plugin, pluginName ) {
		if ( !isUndefined( plugin.options ) && plugin.options.status !== "ready" ) {
			console.error( "Error: Plugin " + pluginName + ". did not finish loading in time." );
			delete this.plugins[ pluginName ];
		}
	} );
	this.loaded = true;
	this.app.pluginsLoaded();
};

/**
 * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param	{string}    modification	The name of the filter
 * @param   {*}         data 		    The data to filter
 * @param   {*}         context		    (optional) Object for passing context parameters to the callable.
 * @returns {*} 		                The filtered data
 * @private
 */
Pluggable.prototype._applyModifications = function( modification, data, context ) {
	var callChain = this.modifications[ modification ];

	if ( callChain instanceof Array && callChain.length > 0 ) {
		callChain = this._stripIllegalModifications( callChain );

		callChain.sort( function( a, b ) {
			return a.priority - b.priority;
		} );
		forEach( callChain, function( callableObject ) {
			var callable = callableObject.callable;
			var newData = callable( data, context );
			if ( typeof newData === typeof data ) {
				data = newData;
			} else {
				console.error( "Modification with name " + modification + " performed by plugin with name " +
				callableObject.origin +
				" was ignored because the data that was returned by it was of a different type than the data we had passed it." );
			}
		} );
	}
	return data;

};

/**
 * Adds new tests to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer The analyzer object to add the tests to
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTests = function( analyzer ) {
	this.customTests.map( function( customTest ) {
		this._addPluginTest( analyzer, customTest );
	}, this );
};

/**
 * Adds one new test to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer              The analyzer that the test will be added to.
 * @param {Object}            pluginTest            The test to be added.
 * @param {string}            pluginTest.name       The name of the test.
 * @param {function}          pluginTest.callable   The function associated with the test.
 * @param {function}          pluginTest.analysis   The function associated with the analyzer.
 * @param {Object}            pluginTest.scoring    The scoring object to be used.
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTest = function( analyzer, pluginTest ) {
	analyzer.addAnalysis( {
		"name": pluginTest.name,
		"callable": pluginTest.analysis
	} );

	analyzer.analyzeScorer.addScoring( {
		"name": pluginTest.name,
		"scoring": pluginTest.scoring
	} );
};

/**
 * Strips modifications from a callChain if they were not added with a valid origin.
 *
 * @param   {Array} callChain	 The callChain that contains items with possible invalid origins.
 * @returns {Array} callChain 	 The stripped version of the callChain.
 * @private
 */
Pluggable.prototype._stripIllegalModifications = function( callChain ) {
	forEach( callChain, function( callableObject, index ) {
		if ( this._validateOrigin( callableObject.origin ) === false ) {
			delete callChain[ index ];
		}
	}.bind( this ) );

	return callChain;
};

/**
 * Validates if origin of a modification has been registered and finished preloading.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated.
 * @returns {boolean}                   Whether or not the origin is valid.
 * @private
 */
Pluggable.prototype._validateOrigin = function( pluginName ) {
	if ( this.plugins[ pluginName ].status !== "ready" ) {
		return false;
	}
	return true;
};

/**
 * Validates if registered plugin has a unique name.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated for uniqueness.
 * @returns {boolean}                   Whether or not the plugin has a unique name.
 * @private
 */
Pluggable.prototype._validateUniqueness = function( pluginName ) {
	if ( !isUndefined( this.plugins[ pluginName ] ) ) {
		return false;
	}
	return true;
};

module.exports = Pluggable;
