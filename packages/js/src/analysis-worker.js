// Ensure the global window is set, our dependencies use it.
self.window = self;

/**
 * These dependencies reference objects and methods that
 * are not available inside a web worker, so we disallow
 * loading them.
 *
 * We need to do that in this file, since we have no
 * control over the dependencies of WordPress dependencies that we want to load.
 *
 * @type {string[]}
 */
const disallowedDependencies = [
	/**
	 * References `Element`, a DOM interface not available in web workers.
	 *
	 * Was renamed, hence the two variants.
	 */
	"wp-inert-polyfill",
	"wp-polyfill-inert",
];

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

		if ( disallowedDependencies.includes( dependency ) ) {
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
