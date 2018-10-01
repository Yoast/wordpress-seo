import { AnalysisWebWorker, AnalysisWorkerWrapper, createWorker } from "./src/worker";
import * as assessments from "./src/assessments";
import * as bundledPlugins from "./src/bundledPlugins";
import * as helpers from "./src/helpers";
import * as markers from "./src/markers";
import * as string from "./src/stringProcessing";
import * as interpreters from "./src/interpreters";
import * as config from "./src/config";

import App from "./src/app";
import Assessor from "./src/assessor";
import ContentAssessor from "./src/contentAssessor";
import TaxonomyAssessor from "./src/taxonomyAssessor";
import Pluggable from "./src/pluggable";
import Researcher from "./src/researcher";
import SnippetPreview from "./src/snippetPreview";
import Paper from "./src/values/Paper";
import AssessmentResult from "./src/values/AssessmentResult";
import SecondaryKeywordAssessor from "./src/secondaryKeywordAssessor";

export {
	App,
	Assessor,
	ContentAssessor,
	TaxonomyAssessor,
	Pluggable,
	Researcher,
	SnippetPreview,
	SecondaryKeywordAssessor,

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
	string,
	interpreters,
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
	Researcher,
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
	string,
	interpreters,
};
