/**
 * @typedef {Object} AnalysisType
 *
 * @property {string} name A unique name.
 * @property {Object.<string, Object>?} assessorConfigurations The assessor configurations, keyed by assessor name.
 * @property {ReplacementVariableConfiguration[]?} replacementVariableConfigurations The replacement variable configurations.
 */

/**
 * @typedef AnalysisConfig
 *
 * @property {string} workerUrl The URL of the analysis worker.
 * @property {string[]} dependencies The dependencies to load in the worker.
 * @property {Object} [configuration] The analysis configuration. Defaults to an English (US) locale.
 * @property {Object.<string, AnalysisType>} [types] The different analysis types and their configuration.
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
import createAnalysis from "./analysis/analysis";
import createAnalysisTypeReplacementVariables from "./replacement-variables";
import { createSeoProvider } from "./seo-context";
export { SEO_STORE_NAME, FOCUS_KEYPHRASE_ID, useAnalyze, MARKER_STATUS } from "@yoast/seo-store";
export { ReadabilityResultsContainer, SeoResultsContainer } from "./analysis-results/containers";
export { default as GooglePreviewContainer } from "./google-preview/containers/google-preview-container";
export { default as FacebookContainer } from "./social/containers/facebook-container";
export { default as TwitterContainer } from "./social/containers/twitter-container";
import * as _replacementVariableConfigurations from "./replacement-variables/configurations";
export { _replacementVariableConfigurations as replacementVariableConfigurations };
export { useSeoContext } from "./seo-context";
/**
 * Creates the SEO integration.
 *
 * @param {AnalysisConfig} analysis Analysis-specific configuration.
 * @param {Object.<string, Object>} [initialState] The initial state for the SEO store.
 *
 * @returns {Promise<SeoIntegrationInterface>} The promise of the SEO integration interface.
 */

const createSeoIntegration = async function () {
  let {
    analysis: {
      workerUrl: analysisWorkerUrl,
      dependencies: analysisDependencies,
      configuration: analysisConfiguration = {
        locale: "en_US"
      }
    },
    contentTypes = {},
    initialState = {}
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    analyze,
    analysisWorker
  } = await createAnalysis({
    workerUrl: analysisWorkerUrl,
    dependencies: analysisDependencies,
    configuration: analysisConfiguration
  });
  registerSeoStore({
    initialState,
    analyze
  });
  const {
    analysisTypeReplacementVariables,
    unregisterReplacementVariables
  } = createAnalysisTypeReplacementVariables(mapValues(contentTypes, "replacementVariableConfigurations"));
  return {
    analysisWorker,
    analysisTypeReplacementVariables,
    unregisterReplacementVariables,
    SeoProvider: createSeoProvider({
      analysisTypeReplacementVariables
    })
  };
};

export default createSeoIntegration;
//# sourceMappingURL=index.js.map