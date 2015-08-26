# YoastSEO.js

[![Build Status](https://travis-ci.org/Yoast/js-text-analysis.svg?branch=master)](https://travis-ci.org/Yoast/js-text-analysis)
[![Code Climate](https://codeclimate.com/repos/5524f75d69568028f6000fda/badges/f503961401819f93c64c/gpa.svg)](https://codeclimate.com/repos/5524f75d69568028f6000fda/feed)

Project bringing the Yoast text analysis functionality to the client side

## Plugins and modifications

A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications. In order to do so, it must first register itself as a plugin with YoastSEO.js. 

### Registering a plugin

If plugins don't need to preload data, they can declare `ready` straight on registration of the plugin:

```JS
YoastSEO.app.plugins.register( 'examplePlugin', {status: 'ready'} );
```

### Preloading data

To keep our content analysis fast, we don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify the content. 

If plugins need to preload data, they can first register, then preload using AJAX and call `ready` once preloaded.

```JS
YoastSEO.app.plugins.register( 'examplePlugin', {status: 'loading'} );
// Load whatever data you need through AJAX.
YoastSEO.app.plugins.ready( 'examplePlugin' );
```

### Loading more data

To minimize client side memory usage, we request plugins to preload as little data as possible. If you need to dynamically fetch more data in the process of content creation, you can reload your data set and let YoastSEO.js know you've reloaded by calling `reloaded`. This will trigger a new analysis to be run. If an analysis is currently running. We will reset it to ensure the latest modifications are applied.

```JS
// Fetch more data in the background and then declare yourself reloaded:
YoastSEO.app.plugins.reloaded( 'examplePlugin' );
```

### Registering modifications

YoasSEO.js has a synchronous modification mechanism that operates much like the filtering mechanism in WordPress (`add_filter|apply_filters`). The modifications that are supported by us are applyed in the following way:

```JS
var modifiedData = YoastSEO.app.plugins._applyModifications( 'exampleModification', 'Data of some type to modify' );
```

A modification is basically a callback function which is registered with YoastSEO.js The callback function should accept a `data` parameter and optionally also a `context` parameter. Only the `data` can be modified and is expected to be returned by the callback function. Registering a modification looks like this:

```JS
/**
 * Adds some text to the data...
 *
 * @param data The data to modify
 */
ExamplePlugin.prototype.myCustomModification = function(data) {
  return data + ' some text to add';
};

/**
 * @param modification 	{string} 	The name of the filter
 * @param callable 		{function} 	The callable
 * @param pluginName 	{string} 	The plugin that is registering the modification.
 * @param priority 		{number} 	(optional) Used to specify the order in which the callables 
 * 									associated with a particular filter are called. Lower numbers
 * 									correspond with earlier execution.
 */
YoastSEO.app.plugins.registerModification( 'exampleModification', myCustomModification, 'examplePlugin', 5 );
```

### Example plugin

So if you do everything as described above, you get a plugin that looks like this:

```JS
ExamplePlugin = function() {
  YoastSEO.app.plugins.register( 'examplePlugin', {status: 'ready'} );
  YoastSEO.app.plugins.registerModification( 'exampleModification', this.myCustomModification, 'examplePlugin', 5 );
}

ExamplePlugin.prototype.myCustomModification = function(data) {
  return data + ' some text to add';
};

new ExamplePlugin();
```
