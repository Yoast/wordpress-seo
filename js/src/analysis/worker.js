// External dependencies.
import {
	get,
	isUndefined,
	merge,
} from "lodash-es";
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";

// Internal dependencies.
import getContentLocale from "./get-content-locale";
import getDefaultQueryParams from "./get-default-query-params";
import getTranslations from "./get-translations";
import isContentAnalysisActive from "./is-content-analysis-active";
import isKeywordAnalysisActive from "./is-keyword-analysis-active";

/**
 * Instantiates an analysis worker (wrapper).
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker.
 */
export function createAnalysisWorker() {
	const url = get( window, [ "wpseoScriptData", "analysis", "worker", "url" ], "analysis-worker.js" );
	return new AnalysisWorkerWrapper( createWorker( url ) );
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
		enabledFeatures: get( window, [ "wpseoScriptData", "analysis", "worker", "enabled_features" ], [] ),
	};

	configuration = merge( configuration, customConfiguration );

	const translations = getTranslations();
	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		configuration.translations = translations;
	}

	return configuration;
}
