/**
 * @typedef {Object} AnalysisType
 *
 * @property {string} name A unique name.
 * @property {Object.<string, Object>?} assessorConfigurations The assessor configurations, keyed by assessor name.
 * @property {ReplacementVariableConfiguration[]?} replacementVariableConfigurations The replacement variable configurations.
 */

/**
 * @typedef {Object} SeoIntegrationInterface
 *
 * @property {AnalysisWorkerWrapper} analysisWorker The analysis worker wrapper.
 * @property {Object<string, ReplacementVariablesInterface[]>} analysisTypeReplacementVariables Replacement variables per analysis type.
 * @property {function} unregisterReplacementVariables Unregisters the replacement variables from the analysis.
 */

import registerSeoStore from "@yoast/seo-store";
import { mapValues } from "lodash";
import createAnalysisWorker from "./analysis";
import createAnalysisTypeReplacementVariables from "./replacement-variables";

export { SEO_STORE_NAME, useAnalyze } from "@yoast/seo-store";

/*
 * The implementation is responsible for the replacement variable configurations per analysis type.
 * This provides a way to get the default configurations to pick from.
 */
export { createDefaultReplacementVariableConfigurations } from "./replacement-variables";

/**
 * Creates the SEO integration.
 *
 * @param {string} analysisWorkerUrl The URL of the analysis worker.
 * @param {string} analysisResearcherUrl The URL of the analysis researcher.
 * @param {Object} [analysisConfiguration] The analysis configuration. Defaults to a English (US) locale.
 * @param {Object.<string, AnalysisType>} [analysisTypes] The different analysis types and their configuration.
 * @param {Object.<string, Object>} [initialState] The initial state for the SEO store.
 *
 * @returns {Promise<SeoIntegrationInterface>} The promise of the SEO integration interface.
 */
const createSeoIntegration = async ( {
	analysisWorkerUrl,
	analysisResearcherUrl,
	analysisConfiguration = { locale: "en_US" },
	analysisTypes = {
		post: {
			name: "post",
			replacementVariableConfigurations: [],
		},
		term: {
			name: "term",
			replacementVariableConfigurations: [],
		},
	},
	initialState = {},
} = {} ) => {
	const analysisWorker = await createAnalysisWorker( {
		workerUrl: analysisWorkerUrl,
		researcherUrl: analysisResearcherUrl,
		configuration: analysisConfiguration,
	} );

	registerSeoStore( { initialState, analyze: analysisWorker.analyze } );

	const { set, unregister } = createAnalysisTypeReplacementVariables( mapValues( analysisTypes, "replacementVariableConfigurations" ) );

	return {
		analysisWorker,
		analysisTypeReplacementVariables: set,
		unregisterReplacementVariables: unregister,
	};
};

export default createSeoIntegration;
