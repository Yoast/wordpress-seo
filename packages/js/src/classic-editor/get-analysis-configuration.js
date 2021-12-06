import { get, mapValues } from "lodash";
import { enabledFeatures } from "@yoast/feature-flag";
import { createDefaultReplacementVariableConfigurations } from "@yoast/seo-integration";
import getTranslations from "../analysis/getTranslations";

/**
 * Creates the analysis-related configuration needed for booting up the SEO integration.
 *
 * @returns {Object} The analysis configuration.
 */
export function getAnalysisConfiguration() {
	// TODO: This is incredibly tightly coupled to the `wpseoScriptData` and `wpseoAdminL10n` global variables. Find a way to decouple it.
	return {
		workerUrl: get( window, [ "wpseoScriptData", "analysis", "worker", "url" ], "analysis-worker.js" ),
		dependencies: get( window, [ "wpseoScriptData", "analysis", "worker", "dependencies" ], {} ),
		types: {
			post: {
				name: "post",
				replacementVariableConfigurations: mapValues( createDefaultReplacementVariableConfigurations() ),
			},
			term: {
				name: "term",
				replacementVariableConfigurations: mapValues( createDefaultReplacementVariableConfigurations() ),
			},
		},
		configuration: {
			locale: get( window, [ "wpseoScriptData", "metabox", "contentLocale" ], "en_US" ),
			defaultQueryParams: get( window, [ "wpseoAdminL10n", "default_query_params" ], {} ),
			logLevel: get( window, [ "wpseoScriptData", "analysis", "worker", "log_level" ], "ERROR" ),
			enabledFeatures: enabledFeatures() || [],
			translations: getTranslations(),
		},
	};
}
