/* global console: true */
/* global setTimeout: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

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
 *
 * @constructor
 * @property preloadThreshold	{number} The maximum time plugins are allowed to preload before we load our content analysis.
 * @property plugins			{object} The plugins that have been registered.
 * @property modifications 		{object} The modifications that have been registered. Every modification contains an array with callables.
 */
YoastSEO.Pluggable = function() {
	this.loaded = false;
	this.preloadThreshold = 3000;
	this.plugins = {};
	this.modifications = {};

	// Allow plugins 500 ms to register before we start polling their
	setTimeout( this.loaderTimerout, 1500 );
};

/**************** PUBLIC DSL ****************/

/**
 * Delegates to `YoastSEO.app.pluggable.registerPlugin`
 *
 * @param pluginName	{string}
 * @param options 		{{status: "ready"|"loading"}}
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.registerPlugin = function( pluginName, options ) {
	this.pluggable._registerPlugin( pluginName, options );
};

/**
 * Delegates to `YoastSEO.app.pluggable.ready`
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.ready = function( pluginName ) {
	this.pluggable._ready( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.reloaded`
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.reloaded = function( pluginName ) {
	this.pluggable._reloaded( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.registerModification`
 *
 * @param modification 	{string} 	The name of the filter
 * @param callable 		{function} 	The callable
 * @param pluginName 	{string} 	The plugin that is registering the modification.
 * @param priority 		{number} 	(optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									Lower numbers correspond with earlier execution.
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.registerModification = function( modification, callable, pluginName, priority ) {
	this.pluggable._registerModification( modification, callable, pluginName, priority );
};

/**************** DSL IMPLEMENTATION ****************/

/**
 * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param pluginName	{string}
 * @param options 		{{status: "ready"|"loading"}}
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._registerPlugin = function( pluginName, options ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( typeof options !== "undefined" && typeof options !== "object" ) {
		console.error( "Failed to register plugin " + pluginName + ". Expected parameters `options` to be a string." );
		return false;
	}

	if ( this._validateUniqueness( pluginName ) === false ) {
		console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
		return false;
	}

	this.plugins[pluginName] = options;
	YoastSEO.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Declare a plugin "ready". Use this if you need to preload data with AJAX.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._ready = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( this.plugins[pluginName] === undefined ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.plugins[pluginName].status = "ready";
	YoastSEO.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._reloaded = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( this.plugins[pluginName] === undefined ) {
		console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	YoastSEO.app.runAnalyzer( YoastSEO.app.rawData );
	return true;
};

/**
 * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
 *
 * @param modification 	{string} 	The name of the filter
 * @param callable 		{function} 	The callable
 * @param pluginName 	{string} 	The plugin that is registering the modification.
 * @param priority 		{number} 	(optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									Lower numbers correspond with earlier execution.
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._registerModification = function( modification, callable, pluginName, priority ) {
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
	if ( this.modifications[modification] === undefined ) {
		this.modifications[modification] = [];
	}

	this.modifications[modification].push( callableObject );

	return true;
};

/**************** PRIVATE HANDLERS ****************/

/**
 * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
 * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
 * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
 *
 * @param pollTime {number} (optional) The accumulated time to compare with the pre-load threshold.
 * @private
 */
YoastSEO.Pluggable.prototype._pollLoadingPlugins = function( pollTime ) {
	pollTime = pollTime === undefined ? 0 : pollTime;
	if ( this._allReady() === true ) {
		this.loaded = true;
		YoastSEO.app.pluginsLoaded();
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
 * @returns {boolean}
 * @private
 */
YoastSEO.Pluggable.prototype._allReady = function() {
	for ( var plugin in this.plugins ) {
		if ( this.plugins[plugin].status !== "ready" ) {
			return false;
		}
	}
	return true;
};

/**
 * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
 *
 * @private
 */
YoastSEO.Pluggable.prototype._pollTimeExceeded = function() {
	for ( var plugin in this.plugins ) {
		if ( this.plugins[plugin].options !== undefined && this.plugins[plugin].options.status !== "ready" ) {
			console.error( "Error: Plugin " + plugin + ". did not finish loading in time." );
			delete this.plugins[plugin];
		}
	}
	this.loaded = true;
	YoastSEO.app.pluginsLoaded();
};

/**
 * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param modification	{string}	The name of the filter
 * @param data 			{*} 		The data to filter
 * @param context 		{*} 		(optional) Object for passing context parameters to the callable.
 * @returns 			{*} 		The filtered data
 * @private
 */
YoastSEO.Pluggable.prototype._applyModifications = function( modification, data, context ) {
	var callChain = this.modifications[modification];

	if ( callChain instanceof Array && callChain.length > 0 ) {
		callChain = this._stripIllegalModifications( callChain );

		callChain.sort( function( a, b ) {
			return a.priority - b.priority;
		} );
		for ( var callableObject in callChain ) {
			var callable = callChain[callableObject].callable;
			var newData = callable( data, context );
			if ( typeof newData === typeof data ) {
				data = newData;
			} else {
				console.error( "Modification with name " + modification + " performed by plugin with name " +
				callChain[callableObject].origin +
				" was ignored because the data that was returned by it was of a different type than the data we had passed it." );
			}
		}
	}
	return data;

};

/**
 * Strips modifications from a callChain if they were not added with a valid origin.
 *
 * @param callChain		{Array}
 * @returns callChain 	{Array}
 * @private
 */
YoastSEO.Pluggable.prototype._stripIllegalModifications = function( callChain ) {
	for ( var callableObject in callChain ) {
		if ( this._validateOrigin( callChain[callableObject].origin ) === false ) {
			delete callChain[callableObject];
		}
	}

	return callChain;
};

/**
 * Validates if origin of a modification has been registered and finished preloading.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 * @private
 */
YoastSEO.Pluggable.prototype._validateOrigin = function( pluginName ) {
	if ( this.plugins[pluginName].status !== "ready" ) {
		return false;
	}
	return true;
};

/**
 * Validates if registered plugin has a unique name.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 * @private
 */
YoastSEO.Pluggable.prototype._validateUniqueness = function( pluginName ) {
	if ( this.plugins[pluginName] !== undefined ) {
		return false;
	}
	return true;
};

/**
 * Triggers the _pollLoadingPlugins. Is defined in seperate function to prevent timingissues with undefined functions
 */
YoastSEO.Pluggable.prototype.loaderTimerout = function( ) {
	YoastSEO.app.plugins._pollLoadingPlugins();
};
