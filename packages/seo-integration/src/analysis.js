import { applyFilters } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import { isObject } from "lodash";
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";

/**
 * Creates the analysis worker.
 *
 * @param {string} workerUrl The URL of the analysis worker.
 * @param {string} researcherUrl The URL of the analysis researcher.
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker wrapper.
 */
const createAnalysisWorkerWrapper = ( { workerUrl, researcherUrl } ) => {
	const worker = createWorker( workerUrl );

	worker.postMessage( { dependencies: [ researcherUrl ] } );

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
	const processedConfig = applyFilters( "yoast.seoIntegration.analysis.configuration", configuration );

	return isObject( processedConfig ) ? processedConfig : configuration;
};

/**
 * Creates the analysis worker.
 *
 * @param {string} workerUrl The URL of the analysis worker.
 * @param {string} researcherUrl The URL of the analysis researcher.
 * @param {Object} configuration The base configuration of the analysis worker.
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker wrapper.
 */
const createAnalysisWorker = async ( { workerUrl, researcherUrl, configuration = {} } ) => {
	const worker = createAnalysisWorkerWrapper( { workerUrl, researcherUrl } );

	try {
		await worker.initialize( createAnalysisConfiguration( configuration ) );
	} catch ( e ) {
		console.error(
			__( "Something went wrong with loading the analysis, please refresh the page to try again.", "wordpress-seo" ),
			e,
		);
	}

	return worker;
};

export default createAnalysisWorker;
