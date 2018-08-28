// External dependencies.
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import merge from "lodash/merge";

// Internal dependencies.
import getContentLocale from "./getContentLocale";
import getTranslations from "./getTranslations";
import isContentAnalysisActive from "./isContentAnalysisActive";
import isKeywordAnalysisActive from "./isKeywordAnalysisActive";

/**
 * Instantiates an analysis worker (wrapper).
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker.
 */
export function createAnalysisWorker() {
	const url = get( global, [ "wpseoAnalysisWorkerL10n", "url" ], "wp-seo-analysis-worker.js" );
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
	};

	configuration = merge( configuration, customConfiguration );

	const translations = getTranslations();
	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		configuration.translations = translations;
	}

	return configuration;
}
