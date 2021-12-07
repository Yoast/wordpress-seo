import { applyFilters } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import { isObject } from "lodash";
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";

import createAnalyzeFunction from "./analyze";

/**
 * Creates the analysis worker.
 *
 * @param {string} workerUrl The URL of the analysis worker.
 * @param {string[]} dependencies The dependencies to load within the worker.
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker wrapper.
 */
const createAnalysisWorkerWrapper = ( { workerUrl, dependencies } ) => {
	const worker = createWorker( workerUrl );

	worker.postMessage( { dependencies: dependencies } );

	return new AnalysisWorkerWrapper( worker );
};

/**
 * Creates the analysis configuration.
 *
 * @param {Object} configuration The base configuration of the analysis worker.
 *
 * @returns {Object} The analysis configuration.
 */
const createAnalysisConfiguration = ( configuration = {} ) => {
	const config = {
		...configuration,
		isContentAnalysisActive: configuration.isReadabilityActive,
		isKeywordAnalysisActive: configuration.isSeoActive,
	};

	delete config.isReadabilityActive;
	delete config.isSeoActive;

	const processedConfig = applyFilters( "yoast.seoIntegration.analysis.configuration", config );

	return isObject( processedConfig ) ? processedConfig : config;
};

/**
 * Creates the analysis worker.
 *
 * @param {string} workerUrl The URL of the analysis worker.
 * @param {string[]} dependencies The dependencies to load in the worker.
 * @param {Object} configuration The base configuration of the analysis worker.
 *
 * @returns {function} The analysis worker wrapper.
 */
const createAnalysis = async ( { workerUrl, dependencies, configuration = {} } ) => {
	const worker = createAnalysisWorkerWrapper( { workerUrl, dependencies } );

	try {
		await worker.initialize( createAnalysisConfiguration( configuration ) );
	} catch ( e ) {
		console.error(
			__( "Something went wrong with loading the analysis, please refresh the page to try again.", "wordpress-seo" ),
			e,
		);
	}

	return {
		analyze: createAnalyzeFunction( worker, configuration ),
	};
};

export default createAnalysis;
