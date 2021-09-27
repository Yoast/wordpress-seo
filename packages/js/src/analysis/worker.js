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
	worker.postMessage( {
		dependencies: get( window, [ "wpseoScriptData", "analysis", "worker", "dependencies" ], [] ),
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
