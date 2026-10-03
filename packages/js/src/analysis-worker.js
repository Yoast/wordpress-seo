// Ensure the global window is set, our dependencies use it.
self.window = self;

/**
 * This array lists the allowed dependencies.
 * We use an allowlist because we have no control over the dependencies that are loaded alongside the web worker.
 *
 * - lodash: used for functional programming.
 * - regenerator-runtime: used for (transpiled) async functions.
 * - wp-hooks: dependency for wp-i18n.
 * - wp-i18n: used for translation strings.
 *
 * @type {string[]}
 */
const allowedDependencies = [
	"lodash",
	"regenerator-runtime",
	"wp-hooks",
	"wp-i18n",
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

		// Check if we allow this dependency to be loaded.
		// A dependency is allowed if it's in the `allowedDependencies` list or if it's an internal dependency.
		if ( ! ( allowedDependencies.includes( dependency ) || dependency.startsWith( "yoast-seo" ) ) ) {
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
		const localeData = translation.locale_data[ domain ] || translation.locale_data.messages;
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
