import { Paper } from "yoastseo";

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
			description: data.metaDescription,
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
 * Analyzes a given paper inside of the analysis web worker.
 *
 * @param {AnalysisWorkerWrapper} worker The analysis web worker.
 * @param {Paper} paper The paper to analyze.
 * @param {Object} relatedKeyphrases The related keyphrases to use in the analysis.
 *
 * @returns {Promise<{Object}>} The results of the analysis.
 */
async function analyzePaper( worker, paper, relatedKeyphrases ) {
	const results = await worker.analyzeRelatedKeywords(
		paper,
		adaptRelatedKeyphrases( relatedKeyphrases ),
	);

	return adaptResults( results );
}

/**
 * Runs a list of researches inside of the web worker.
 *
 * @param {string[]} researches The list of research names to run.
 * @param {AnalysisWorkerWrapper} worker The analysis web worker.
 * @param {Paper} paper The paper to run the researches on.
 *
 * @returns {Promise<Object>} The research results.
 */
async function runResearches( researches, worker, paper ) {
	const results = {};

	for ( const research of researches ) {
		results[ research ] = await worker.runResearch( research, paper );
	}

	return results;
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
export default function createAnalyzeFunction( worker, configuration ) {
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

		const paper = createPaper( data, focus, configuration );

		const analysisResults = await analyzePaper( worker, paper, relatedKeyphrases );
		const researchResults = await runResearches( config.researches, worker, paper );

		return Object.assign( analysisResults, { research: researchResults } );
	};
}
