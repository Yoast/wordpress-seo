// External dependencies.
import {
	get,
	isUndefined,
	merge,
} from "lodash-es";
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";

// Internal dependencies.
import getContentLocale from "./getContentLocale";
import getDefaultQueryParams from "./getDefaultQueryParams";
import getTranslations from "./getTranslations";
import isContentAnalysisActive from "./isContentAnalysisActive";
import isKeywordAnalysisActive from "./isKeywordAnalysisActive";
import { enabledFeatures } from "@yoast/feature-flag";

/**
 * Instantiates an analysis worker (wrapper).
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker.
 */
export function createAnalysisWorker() {
	const url    = get( window, [ "wpseoScriptData", "analysis", "worker", "url" ], "analysis-worker.js" );
	const worker = createWorker( url );
	const dependencies = get( window, [ "wpseoScriptData", "analysis", "worker", "dependencies" ], [] );
	const translations = [];

	for ( const dependency in dependencies ) {
		if ( ! Object.prototype.hasOwnProperty.call( dependencies, dependency ) ) {
			continue;
		}

		/*
		 * Extract the locale and translation data from the translations script to send off to the worker.
		 *
		 * Example translationElement:
		 * <script id="yoast-seo-analysis-package-js-translations">
		 * 	( function( domain, translations ) {
		 * 		var localeData = translations.locale_data[ domain ] || translations.locale_data.messages;
		 * 		localeData[ "" ].domain = domain;
		 * 		wp.i18n.setLocaleData( localeData, domain );
		 * 	} )( "wordpress-seo", { "locale_data": { "messages": { "": {} } } } );
		 * </script>
		 */
		const translationElement = window.document.getElementById( `${dependency}-js-translations` );
		if ( ! translationElement ) {
			continue;
		}
		const text = translationElement.innerHTML.slice( 214 );
		const split = text.indexOf( "," );
		const domain = text.slice( 0, split - 1 );
		try {
			const translationData = JSON.parse( text.slice( split + 1, -4 ) );
			translations.push( [ domain, translationData ] );
		} catch ( e ) {
			console.warn( `Failed to parse translation data for ${dependency} to send to the Yoast SEO worker` );
			continue;
		}
	}

	worker.postMessage( {
		dependencies,
		translations,
	} );

	return new AnalysisWorkerWrapper( worker );
}

/**
 * Retrieves the analysis configuration for the worker.
 *
 * @param {Object} [customConfiguration] The custom configuration to use.
 *
 * @returns {Object} The analysis configuration.
 */
export function getAnalysisConfiguration( customConfiguration = {} ) {
	let configuration = {
		locale: getContentLocale(),
		contentAnalysisActive: isContentAnalysisActive(),
		keywordAnalysisActive: isKeywordAnalysisActive(),
		defaultQueryParams: getDefaultQueryParams(),
		logLevel: get( window, [ "wpseoScriptData", "analysis", "worker", "log_level" ], "ERROR" ),
		enabledFeatures: enabledFeatures(),
	};

	configuration = merge( configuration, customConfiguration );

	const translations = getTranslations();
	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		configuration.translations = translations;
	}

	return configuration;
}
