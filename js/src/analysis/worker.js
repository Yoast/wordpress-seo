// External dependencies.
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";
import get from "lodash/get";
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
	const url = get( global, [ "wpseoAnalysisWorkerL10n", "url" ], "wp-seo-analysis-worker.js" );
	return new AnalysisWorkerWrapper( createWorker( url ) );
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
