import { isObject, omit } from "lodash";
import { applyFilters } from "@wordpress/hooks";

/**
 * Creates the analysis configuration.
 *
 * @param {Object} configuration The base configuration of the analysis worker.
 *
 * @returns {Object} The analysis configuration.
 */
const createAnalysisConfiguration = ( configuration = {} ) => {
	const config = {
		...omit( configuration, [ "isReadabilityActive", "isSeoActive", "shouldApplyCornerstoneAnalysis" ] ),
		isContentAnalysisActive: configuration.isReadabilityActive,
		isKeywordAnalysisActive: configuration.isSeoActive,
		useCornerstone: configuration.shouldApplyCornerstoneAnalysis,
	};

	const processedConfig = applyFilters( "yoast.seoIntegration.analysis.configuration", config );

	return isObject( processedConfig ) ? processedConfig : config;
};

export default createAnalysisConfiguration;
