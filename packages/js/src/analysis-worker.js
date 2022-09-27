// Ensure the global window is set, our dependencies use it.
self.window = self;

/**
 * Loads dependencies.
 *
 * @param {Object<string, string>} dependencies The dependencies.
 *
 * @returns {void}
 */
function loadDependencies( dependencies ) {
	for ( const dependency in dependencies ) {
		if ( ! Object.prototype.hasOwnProperty.call( dependencies, dependency ) ) {
			continue;
		}

		self.importScripts( dependencies[ dependency ] );

		if ( dependency === "lodash" ) {
			// eslint-disable-next-line no-undef
	        self.lodash = _.noConflict();
		}
	}
}

/**
 * Loads translations.
 *
 * @param {Object[]} translations The translations.
 *
 * @returns {void}
 */
function loadTranslations( translations ) {
	for ( const [ domain, translation ] of translations ) {
		var localeData = translation.locale_data[ domain ] || translation.locale_data.messages;
		localeData[ "" ].domain = domain;
		self.wp.i18n.setLocaleData( localeData, domain );
	}
}

self.onmessage = ( { data } ) => {
	if ( ! data || ! data.dependencies ) {
		return;
	}

	loadDependencies( data.dependencies );

	if ( data.translations ) {
		loadTranslations( data.translations );
	}

	const Researcher = self.yoast.Researcher.default;
	const worker = new self.yoast.analysis.AnalysisWebWorker( self, new Researcher() );
	worker.register();
};
