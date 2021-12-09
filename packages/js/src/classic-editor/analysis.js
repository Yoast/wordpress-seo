import { enabledFeatures } from "@yoast/feature-flag";
import { get } from "lodash";
import getTranslations from "../analysis/getTranslations";
import isContentAnalysisActive from "../analysis/isContentAnalysisActive";
import isKeywordAnalysisActive from "../analysis/isKeywordAnalysisActive";
import { createPostReplacementVariableConfigurations, createTermReplacementVariableConfigurations } from "./replacement-variables";

/**
 * Creates the analysis-related configuration needed for booting up the SEO integration.
 *
 * @returns {Object} The analysis configuration.
 */
export function getAnalysisConfiguration() {
	return {
		workerUrl: get( window, [ "wpseoScriptData", "analysis", "worker", "url" ], "analysis-worker.js" ),
		dependencies: get( window, [ "wpseoScriptData", "analysis", "worker", "dependencies" ], {} ),
		types: {
			post: {
				name: "post",
				replacementVariableConfigurations: createPostReplacementVariableConfigurations(),
			},
			term: {
				name: "term",
				replacementVariableConfigurations: createTermReplacementVariableConfigurations(),
			},
		},
		configuration: {
			locale: get( window, [ "wpseoScriptData", "metabox", "contentLocale" ], "en_US" ),
			defaultQueryParams: get( window, [ "wpseoAdminL10n", "default_query_params" ], {} ),
			logLevel: get( window, [ "wpseoScriptData", "analysis", "worker", "log_level" ], "ERROR" ),
			enabledFeatures: enabledFeatures(),
			translations: getTranslations(),
			isSeoActive: isKeywordAnalysisActive(),
			isReadabilityActive: isContentAnalysisActive(),
		},
	};
}
