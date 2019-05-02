// External dependencies.
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import merge from "lodash/merge";
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";

// Internal dependencies.
import getContentLocale from "./getContentLocale";
import getDefaultQueryParams from "./getDefaultQueryParams";
import getTranslations from "./getTranslations";
import isContentAnalysisActive from "./isContentAnalysisActive";
import isKeywordAnalysisActive from "./isKeywordAnalysisActive";

/**
 * Instantiates an analysis worker (wrapper).
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker.
 */
export function createAnalysisWorker() {
	const url = get( window, [ "wpseoAnalysisWorkerL10n", "url" ], "wp-seo-analysis-worker.js" );
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
		logLevel: get( window, [ "wpseoAnalysisWorkerL10n", "log_level" ], "ERROR" ),
		enabledFeatures: get( window, [ "wpseoAnalysisWorkerL10n", "enabled_features" ], [] ),
	};

	configuration = merge( configuration, customConfiguration );

	const translations = getTranslations();
	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		configuration.translations = translations;
	}

	return configuration;
}
