import { AnalysisWebWorker, AnalysisWorkerWrapper, createWorker } from "./worker/index.js";
import * as assessments from "./scoring/assessments/index.js";
import * as bundledPlugins from "./bundledPlugins/index.js";
import * as helpers from "./helpers/index.js";
import * as markers from "./markers/index.js";
import * as interpreters from "./scoring/interpreters/index.js";
import * as config from "./config/index.js";
import * as languageProcessing from "./languageProcessing/index.js";
import * as values from "./values/index.js";
import * as assessors from "./scoring/assessors/index.js";
import App from "./app.js";
import Assessor from "./scoring/assessors/assessor.js";
import ContentAssessor from "./scoring/assessors/contentAssessor.js";
import SeoAssessor from "./scoring/assessors/seoAssessor.js";
import TaxonomyAssessor from "./scoring/assessors/taxonomyAssessor.js";
import Pluggable from "./pluggable.js";
import Paper from "./values/Paper.js";
import { ensureTree } from "./parse/ensureTree.js";
import { runAssessment } from "./scoring/runAssessment.js";
import AssessmentResult from "./values/AssessmentResult.js";
import Assessment from "./scoring/assessments/assessment.js";
import { DIFFICULTY } from "./languageProcessing/researches/getFleschReadingScore.js";

import Factory from "./helpers/factory.js";

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
	ensureTree,
	runAssessment,
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
