import { applyFilters } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import { isObject } from "lodash";
import { AnalysisWorkerWrapper, createWorker, Paper } from "yoastseo";

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
	const processedConfig = applyFilters( "yoast.seoIntegration.analysis.configuration", configuration );

	return isObject( processedConfig ) ? processedConfig : configuration;
};

/**
 * Creates a paper based on the given data, keyphrase and configuration.
 *
 * @param {Object} data The paper data and metadata, e.g. content, title, date, slug.
 * @param {Object} keyphrase The keyphrase to use for the analysis.
 * @param {Object} configuration Extra configuration.
 *
 * @returns {Paper} A paper that can be analyzed using the web worker.
 */
function createPaper( data, keyphrase, configuration ) {
	return new Paper(
		data.content,
		{
			// Keyphrase data.
			keyword: keyphrase.keyphrase,
			synonyms: keyphrase.synonyms,
			// General data and metadata.
			description: data.metadescription,
			title: data.seoTitle,
			titleWidth: data.seoTitleWidth,
			permalink: data.slug,
			date: data.date,
			// Configuration data.
			locale: configuration.locale,
		},
	);
}

/**
 * Adapts the object with related keyphrases to a a structure
 * that the analysis web worker is able to consume.
 *
 * @param {Object} relatedKeyphrases The related keyphrases.
 *
 * @returns {Object} The transformed related keyphrases.
 */
function adaptRelatedKeyphrases( relatedKeyphrases ) {
	const transformed = {};

	Object.keys( relatedKeyphrases ).forEach(
		id => {
			transformed[ id ] = {
				keyword: relatedKeyphrases[ id ].keyphrase,
				synonyms: relatedKeyphrases[ id ].synonyms,
			};
		},
	);

	return  transformed;
}

/**
 * Adapt the results from the analysis to the structure
 * that the SEO store expects.
 *
 * @param {Object} results The results returned by the analysis web worker.
 *
 * @returns {Object} The adapted results.
 */
function adaptResults( results ) {
	const { seo, readability } = results.result;

	// Split out the SEO result of the main focus keyphrase.
	const focusKeyphraseResults = seo[ "" ];
	delete seo[ "" ];

	return {
		seo: {
			focus: focusKeyphraseResults,
			...seo,
		},
		readability,
	};
}

/**
 * Creates a callback function to trigger a new analysis
 * based on the given analysis web worker and configuration.
 *
 * @param {AnalysisWorkerWrapper} worker The web worker wrapper.
 * @param {Object} configuration Configuration.
 *
 * @returns {function} The analysis callback function.
 */
function createAnalyzeFunction( worker, configuration ) {
	/**
	 * A callback function that analyzes the data from the SEO store.
	 *
	 * @param {Object} data The data from the SEO store.
	 * @param {Object} keyphrases The keyphrases to analyze.
	 * @param {Object} [config] Optional extra configuration to use.
	 *
	 * @returns {Object} The results of the analysis.
	 */
	return async ( data, keyphrases, config = {} ) => {
		const { focus, ...relatedKeyphrases } = keyphrases;

		const results = await worker.analyzeRelatedKeywords(
			createPaper( data, focus, configuration ),
			adaptRelatedKeyphrases( relatedKeyphrases ),
		);

		return adaptResults( results );
	};
}

/**
 * Creates the analysis worker.
 *
 * @param {string} workerUrl The URL of the analysis worker.
 * @param {string[]} dependencies The dependencies to load in the worker.
 * @param {Object} configuration The base configuration of the analysis worker.
 *
 * @returns {function} The analysis worker wrapper.
 */
const createAnalysisWorker = async( { workerUrl, dependencies, configuration = {} } ) => {
	const worker = createAnalysisWorkerWrapper( { workerUrl, dependencies } );

	try {
		await worker.initialize( createAnalysisConfiguration( configuration ) );
	} catch ( e ) {
		console.error(
			__( "Something went wrong with loading the analysis, please refresh the page to try again.", "wordpress-seo" ),
			e,
		);
	}

	return createAnalyzeFunction( worker, configuration );
};

export default createAnalysisWorker;
