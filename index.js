import { AnalysisWebWorker, AnalysisWorkerWrapper, createWorker } from "./src/worker";
import * as assessments from "./src/assessments";
import * as bundledPlugins from "./src/bundledPlugins";
import * as helpers from "./src/helpers";
import * as markers from "./src/markers";
import * as string from "./src/stringProcessing";
import * as interpreters from "./src/interpreters";
import * as config from "./src/config";

module.exports = {
	Assessor: require( "./src/assessor" ),
	SEOAssessor: require( "./src/seoAssessor" ),
	ContentAssessor: require( "./src/contentAssessor" ),
	TaxonomyAssessor: require( "./src/taxonomyAssessor" ),
	App: require( "./src/app" ),
	Pluggable: require( "./src/pluggable" ),
	Researcher: require( "./src/researcher" ),
	SnippetPreview: require( "./src/snippetPreview" ),

	Paper: require( "./src/values/Paper" ),
	AssessmentResult: require( "./src/values/AssessmentResult" ),

	AnalysisWebWorker,
	AnalysisWorkerWrapper,
	createWorker,

	assessments,
	bundledPlugins,
	helpers,
	markers,
	string,
	interpreters,
	config,
};
