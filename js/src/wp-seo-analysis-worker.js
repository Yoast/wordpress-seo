// Ensure the global window is set, our dependencies use it.
self.window = self;

// We only know the URL of the worker script, so base all other files names on that.
self.importScripts( self.location.href.replace( "wp-seo-analysis-worker", "commons" ) );
self.importScripts( self.location.href.replace( "wp-seo-analysis-worker", "analysis" ) );

import "babel-polyfill";

const worker = new self.yoast.analysis.AnalysisWebWorker( self );
worker.register();
