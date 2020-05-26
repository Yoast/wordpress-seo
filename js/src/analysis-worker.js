// Ensure the global window is set, our dependencies use it.
self.window = self;

const originalUrl = self.yoastOriginalUrl || self.location.href;

// We only know the URL of the worker script, so base all other files names on that.
self.importScripts( originalUrl.replace( "analysis-worker", "commons" ) );
self.importScripts( originalUrl.replace( "analysis-worker", "analysis" ) );

import "babel-polyfill";

const worker = new self.yoast.analysis.AnalysisWebWorker( self );
worker.register();
