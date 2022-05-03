## Plugins and modifications

A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications. In order to do so, it must first register itself as a plugin with YoastSEO.js.

### Registering a plugin

If plugins don't need to preload data, they can declare `ready` straight on registration of the plugin:

```JS
YoastSEO.app.registerPlugin( 'examplePlugin', {status: 'ready'} );
```

### Preloading data

To keep our content analysis fast, we don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify the content.

If plugins need to preload data, they can first register, then preload using AJAX and call `pluginReady` once preloaded.

```JS
YoastSEO.app.registerPlugin( 'examplePlugin', {status: 'loading'} );
// Load whatever data you need through AJAX.
YoastSEO.app.pluginReady( 'examplePlugin' );
```

### Loading more data

To minimize client side memory usage, we request plugins to preload as little data as possible. If you need to dynamically fetch more data in the process of content creation, you can reload your data set and let YoastSEO.js know you've reloaded by calling `pluginReloaded`. This will trigger a new analysis to be run. If an analysis is currently running. We will reset it to ensure the latest modifications are applied.

```JS
// Fetch more data in the background and then declare yourself reloaded:
YoastSEO.app.pluginReloaded( 'examplePlugin' );
```

### Modifications

#### Supported modifications

YoastSEO.js has a synchronous modification mechanism that operates much like the filtering mechanism in WordPress (`add_filter|apply_filters`). We currently have support for the following modifications (more might follow):
* `content`
* `data_page_title`
* `data_meta_desc`

The modifications that are supported by us are applyed in the following way:

```JS
var modifiedData = YoastSEO.app.pluggable._applyModifications( 'content', 'The content to modify' );
```

Modifications can be added by using `YoastSEO.app.registerModification`. Please see the example implementation below:

#### Example implementation

A modification is basically a callback function which is registered with YoastSEO.js The callback function should accept a `data` parameter and optionally also a `context` parameter. Only the `data` can be modified and is expected to be returned by the callback function. A complete plugin looks like this:

```JS
ExamplePlugin = function() {
  YoastSEO.app.registerPlugin( 'examplePlugin', {status: 'ready'} );

  /**
   * @param modification 	{string} 	The name of the filter
   * @param callable 		{function} 	The callable
   * @param pluginName 	    {string} 	The plugin that is registering the modification.
   * @param priority 		{number} 	(optional) Used to specify the order in which the callables
   * 									associated with a particular filter are called. Lower numbers
   * 									correspond with earlier execution.
   */
  YoastSEO.app.registerModification( 'content', this.myContentModification, 'examplePlugin', 5 );
}

/**
 * Adds some text to the data...
 *
 * @param data The data to modify
 */
ExamplePlugin.prototype.myContentModification = function(data) {
  return data + ' some text to add';
};

new ExamplePlugin();
```
