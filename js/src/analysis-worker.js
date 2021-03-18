// Ensure the global window is set, our dependencies use it.
self.window = self;

self.onmessage = ( { data } ) => {
	if ( ! data || ! data.dependencies ) {
		return;
	}

	for ( const dependency in data.dependencies ) {
		if ( ! Object.prototype.hasOwnProperty.call( data.dependencies, dependency ) ) {
			continue;
		}

		self.importScripts( data.dependencies[ dependency ] );

		if ( dependency === "lodash" ) {
			// eslint-disable-next-line no-undef
	        self.lodash = _.noConflict();
		}
	}

	const Researcher = self.yoast.Researcher.default;
	const worker = new self.yoast.analysis.AnalysisWebWorker( self, new Researcher() );
	worker.register();
};
