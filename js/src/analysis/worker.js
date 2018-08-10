// External dependencies.
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";
import isUndefined from "lodash/isUndefined";

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
	return new AnalysisWorkerWrapper( createWorker( "http://localhost:8080/wp-seo-analysis-worker-80-RC1.js?ver=8.0-RC1" ) );
}

/**
 * Retrieves the analysis configuration for the worker.
 *
 * @returns {Object} The analysis configuration.
 */
export function getAnalysisConfiguration() {
	const configuration = {
		locale: getContentLocale(),
		contentAnalysisActive: isContentAnalysisActive(),
		keywordAnalysisActive: isKeywordAnalysisActive(),
	};

	const translations = getTranslations();
	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		configuration.translations = translations;
	}

	return configuration;
}
