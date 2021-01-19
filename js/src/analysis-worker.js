// Ensure the global window is set, our dependencies use it.
self.window = self;

import "babel-polyfill";

self.onmessage = ( data ) => {
    const originalUrl = self.yoastOriginalUrl || self.location.href;

    // We only know the URL of the worker script, so base all other files names on that.
    self.importScripts( originalUrl.replace( "analysis-worker", "commons" ) );
    self.importScripts( originalUrl.replace( "analysis-worker", "yoast/feature-flag" ) );
    self.importScripts( originalUrl.replace( "analysis-worker", "analysis" ) );
    self.importScripts( originalUrl.replace( "analysis-worker", "languages/" + data.language ) );

    const worker = new self.yoast.analysis.AnalysisWebWorker( self, new self.yoast.Researcher() );
    worker.register();
}
