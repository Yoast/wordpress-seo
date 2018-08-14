import { AnalysisWebWorker, AnalysisWorkerWrapper, createWorker } from "./js/worker";
import * as assessments from "./js/assessments";
import * as bundledPlugins from "./js/bundledPlugins";
import * as helpers from "./js/helpers";
import * as markers from "./js/markers";
import * as string from "./js/stringProcessing";
import * as interpreters from "./js/interpreters";
import * as config from "./js/config";

module.exports = {
	Assessor: require( "./js/assessor" ),
	SEOAssessor: require( "./js/seoAssessor" ),
	ContentAssessor: require( "./js/contentAssessor" ),
	App: require( "./js/app" ),
	Pluggable: require( "./js/pluggable" ),
	Researcher: require( "./js/researcher" ),
	SnippetPreview: require( "./js/snippetPreview" ),

	Paper: require( "./js/values/Paper" ),
	AssessmentResult: require( "./js/values/AssessmentResult" ),

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
