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
 * @property {Object<string, ReplacementVariable[]>} analysisTypeReplacementVariables Replacement variables per analysis type.
 * @property {function} unregisterReplacementVariables Unregisters the replacement variables from the analysis.
 */

import registerSeoStore from "@yoast/seo-store";
import { mapValues } from "lodash";
import createAnalysisWorker from "./analysis";
import createAnalysisTypeReplacementVariables from "./replacement-variables";

/*
 * The implementation is responsible for the replacement variable configurations per analysis type.
 * Provide a way to get the default configurations, as well as a helper to merge configurations.
 */
export { createDefaultReplacementVariableConfigurations, mergeReplacementVariableConfigurations } from "./replacement-variables";

/**
 * Creates the SEO integration.
 *
 * @param {string} analysisWorkerUrl The URL of the analysis worker.
 * @param {string} analysisResearcherUrl The URL of the analysis researcher.
 * @param {Object} [analysisConfiguration] The analysis configuration. Defaults to a English (US) locale.
 * @param {Object.<string, AnalysisType>} [analysisTypes] The different analysis types and their configuration.
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
} = {} ) => {
	const analysisWorker = await createAnalysisWorker( {
		workerUrl: analysisWorkerUrl,
		researcherUrl: analysisResearcherUrl,
		config: analysisConfiguration,
	} );

	registerSeoStore( { analyze: analysisWorker.analyze } );

	const { set, unregister } = createAnalysisTypeReplacementVariables( mapValues( analysisTypes, "replacementVariableConfigurations" ) );

	return {
		analysisWorker,
		analysisTypeReplacementVariables: set,
		unregisterReplacementVariables: unregister,
	};
};

export default createSeoIntegration;
