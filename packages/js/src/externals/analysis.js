/**
 * Ugly work-around alert.
 * Using an indirect path to prevent a circular dependency.
 * This way, we prevent the dependency on the `yoast-seo-analysis-package`.
 *
 * Ideally, this would be a configuration without the `yoastseo` external.
 * But that would require the config with a different DependencyExtractionWebpackPlugin configuration.
 */
const {
	App,
	TaxonomyAssessor,

	Paper,

	AnalysisWebWorker,
	AnalysisWorkerWrapper,
	createWorker,

	assessments,
	bundledPlugins,
	helpers,
	markers,
	interpreters,
	languageProcessing,

	DIFFICULTY,
} = require( "yoastseo/build" );

module.exports = {
	App,
	TaxonomyAssessor,
	Paper,
	AnalysisWebWorker,
	AnalysisWorkerWrapper,
	createWorker,
	assessments,
	bundledPlugins,
	helpers,
	markers,
	interpreters,
	languageProcessing,
	DIFFICULTY,
};
