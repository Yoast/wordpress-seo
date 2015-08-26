# js-text-analysis

[![Build Status](https://travis-ci.org/Yoast/js-text-analysis.svg?branch=master)](https://travis-ci.org/Yoast/js-text-analysis)
[![Code Climate](https://codeclimate.com/repos/5524f75d69568028f6000fda/badges/f503961401819f93c64c/gpa.svg)](https://codeclimate.com/repos/5524f75d69568028f6000fda/feed)

Project bringing the Yoast text analysis functionality to the client side

## Plugins and modifications

A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications. In order to do so, it must first register itself as a plugin with YoastSEO.js. 

If plugins don't need to preload data, they can declare `ready` straight on registration of the plugin:

```JS
YoastSEO.app.plugins.register( 'examplePlugin', {status: 'ready'} );
```

### Preloading data

To keep our content analysis fast, we don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify the content. 

If plugins need to preload data, they can first register, then preload using AJAX and call `ready` once preloaded.

```JS
YoastSEO.app.plugins.register( 'examplePlugin', {status: 'loading' );
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

YoasSEO.js has a synchronous modification mechanism. 
