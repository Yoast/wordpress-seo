import { AnalysisWebWorker, AnalysisWorkerWrapper, createWorker } from "./src/worker";
import * as assessments from "./src/scoring/assessments";
import * as bundledPlugins from "./src/bundledPlugins";
import * as helpers from "./src/helpers";
import * as markers from "./src/markers";
import * as interpreters from "./src/scoring/interpreters";
import * as config from "./src/config";
import * as languageProcessing from "./src/languageProcessing";
import * as values from "./src/values";
import App from "./src/app";
import Assessor from "./src/scoring/assessor";
import ContentAssessor from "./src/scoring/contentAssessor";
import SeoAssessor from "./src/scoring/seoAssessor";
import TaxonomyAssessor from "./src/scoring/taxonomyAssessor";
import Pluggable from "./src/pluggable";
import SnippetPreview from "./src/snippetPreview/snippetPreview";
import Paper from "./src/values/Paper";
import AssessmentResult from "./src/values/AssessmentResult";
import Assessment from "./src/scoring/assessments/assessment";
import { DIFFICULTY } from "./src/languageProcessing/researches/getFleschReadingScore";

/*
 * Everything exported here is put on the `yoast.analysis` global in the plugin.
 */
export {
	App,
	Assessor,
	ContentAssessor,
	SeoAssessor,
	TaxonomyAssessor,
	Pluggable,
	SnippetPreview,

	Paper,
	AssessmentResult,
	Assessment,

	AnalysisWebWorker,
	AnalysisWorkerWrapper,
	createWorker,

	assessments,
	bundledPlugins,
	config,
	helpers,
	markers,
	interpreters,
	languageProcessing,
	values,

	DIFFICULTY,
};

/*
 * Used for backwards compatibility reasons.
 * For new exports, please add it as a named dependency above instead.
 */
export default {
	App,
	Assessor,
	ContentAssessor,
	TaxonomyAssessor,
	Pluggable,
	SnippetPreview,

	Paper,
	AssessmentResult,

	AnalysisWebWorker,
	AnalysisWorkerWrapper,
	createWorker,

	assessments,
	bundledPlugins,
	config,
	helpers,
	markers,
	interpreters,
	languageProcessing,
	values,
};
