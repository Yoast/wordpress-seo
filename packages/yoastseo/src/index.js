import { AnalysisWebWorker, AnalysisWorkerWrapper, createWorker } from "./worker";
import * as assessments from "./scoring/assessments";
import * as bundledPlugins from "./bundledPlugins";
import * as helpers from "./helpers";
import * as markers from "./markers";
import * as interpreters from "./scoring/interpreters";
import * as config from "./config";
import * as languageProcessing from "./languageProcessing";
import * as values from "./values";
import * as assessors from "./scoring/assessors";
import App from "./app";
import Assessor from "./scoring/assessors/assessor";
import ContentAssessor from "./scoring/assessors/contentAssessor";
import SeoAssessor from "./scoring/assessors/seoAssessor";
import TaxonomyAssessor from "./scoring/assessors/taxonomyAssessor";
import Pluggable from "./pluggable";
import Paper from "./values/Paper";
import AssessmentResult from "./values/AssessmentResult";
import Assessment from "./scoring/assessments/assessment";
import { DIFFICULTY } from "./languageProcessing/researches/getFleschReadingScore";

import Factory from "./helpers/factory";

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

	Paper,
	AssessmentResult,
	Assessment,

	AnalysisWebWorker,
	AnalysisWorkerWrapper,
	createWorker,

	assessments,
	assessors,
	bundledPlugins,
	config,
	helpers,
	markers,
	interpreters,
	languageProcessing,
	values,

	DIFFICULTY,

	Factory,
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
