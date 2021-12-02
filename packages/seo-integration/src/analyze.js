import { mapKeys, mapValues, zipObject } from "lodash";
import { Paper } from "yoastseo";
import { FOCUS_KEYPHRASE_ID } from "@yoast/seo-store";

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
 * Transforms the object with related keyphrases to a a structure
 * that the analysis web worker is able to consume.
 *
 * @param {Object} relatedKeyphrases The related keyphrases.
 *
 * @returns {Object} The transformed related keyphrases.
 */
function transformRelatedKeyprases( relatedKeyphrases ) {
	return mapValues( relatedKeyphrases, ( { keyphrase: keyword, synonyms } ) => (
		{ keyword, synonyms }
	) );
}

/**
 * Serialize the assessment results of each keyphrase.
 *
 * @param {Object} seoResults The SEO results object.
 *
 * @returns {Object} The SEO results object, but with the assessment results serialized.
 */
function serializeSeoResults( seoResults ) {
	return mapValues(
		seoResults,
		( { score, results } ) => (
			{ score, results: results.map( result => result.serialize() ) }
		),
	);
}

/**
 * Put the focus keyphrase results under the `FOCUS_KEYPHRASE_ID` key, instead of the "" key.
 *
 * @param {Object} seoResults The results of the SEO analysis, each key corresponds to a keyphrase.
 *
 * @returns {Object} The results of the SEO analysis, where the focus keyphrase is available under the `FOCUS_KEYPHRASE_ID` key.
 */
function renameFocusKeyphraseKey( seoResults ) {
	return mapKeys( seoResults, ( _, key ) => key === "" ? FOCUS_KEYPHRASE_ID : key );
}

/**
 * Transforms the results from the analysis to the structure
 * that the SEO store expects.
 *
 * @param {Object} analysisResults The results returned by the analysis web worker.
 *
 * @returns {Object} The adapted results.
 */
function transformAnalysisResults( analysisResults ) {
	const results = {
		seo: analysisResults.result.seo,
		readability: analysisResults.result.readability,
	};

	results.seo = renameFocusKeyphraseKey( results.seo );

	results.seo = serializeSeoResults( results.seo );
	results.readability.results = results.readability.results.map( result => result.serialize() );

	return results;
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
	// Analyzing related keyphrases also analyzes the focus keyphrase.
	const results = await worker.analyzeRelatedKeywords(
		paper,
		transformRelatedKeyprases( relatedKeyphrases ),
	);

	return transformAnalysisResults( results );
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
	const results = await Promise.all(
		researches.map( research => worker.runResearch( research, paper ) ),
	);

	return zipObject( researches, results );
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
		const { [ FOCUS_KEYPHRASE_ID ]: focusKeyphrase, ...relatedKeyphrases } = keyphrases;

		const paper = createPaper( data, focusKeyphrase, configuration );

		const [ analysisResults, researchResults ] = await Promise.all( [
			analyzePaper( worker, paper, relatedKeyphrases ),
			runResearches( config.researches, worker, paper ),
		] );

		analysisResults.research = researchResults;

		return analysisResults;
	};
}
