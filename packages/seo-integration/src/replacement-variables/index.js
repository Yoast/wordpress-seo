import { addFilter, applyFilters, removeFilter } from "@wordpress/hooks";
import createReplacementVariables from "@yoast/replacement-variables";
import { get, identity, mapValues } from "lodash";

/**
 * Registers the replacement variables to be used inside the analysis.
 *
 * @param {Object.<string, function>} applyers Apply functions, keyed per analysis type.
 *
 * @returns {function} Unregister function.
 */
const registerApplyReplacementVariables = ( applyers ) => {
	/**
	 * Creates an apply replacement variables function for objects for the current analysis type.
	 *
	 * @param {Object} paper The paper to analyze.
	 * @param {string} analysisType The current analysis type to apply the replacement variables for.
	 *
	 * @returns {function(Object): string} The apply replacement variables function for objects.
	 */
	const applyReplacementVariables = ( paper, { config: { analysisType } } ) => (
		mapValues( paper, get( applyers, analysisType, identity ) )
	);

	addFilter(
		"yoast.seoStore.analysis.preparePaper",
		"yoast/seoIntegration/applyReplacementVariables",
		applyReplacementVariables,
		10,
	);

	return () => removeFilter( "yoast.seoStore.analysis.preparePaper", "yoast/seoIntegration/applyReplacementVariables" );
};

/**
 * Creates and registers the replacement variables to be used inside the analysis.
 *
 * @param {Object.<string, ReplacementVariableConfiguration[]>} configurations The replacement variables configurations per analysis type.
 *
 * @returns {{
 *   analysisTypeReplacementVariables: Object.<string, ReplacementVariablesInterface[]>,
 *   unregisterApplyReplacementVariables: function
 * }} The replacement variables interface.
 */
const createAnalysisTypeReplacementVariables = ( configurations ) => {
	const filteredConfigurations = applyFilters( "yoast.seoIntegration.replacementVariables.configurations", configurations );
	const analysisTypeReplacementVariables = mapValues(
		filteredConfigurations,
		( analysisTypeConfigurations, analysisType ) => {
			const filteredAnalysisTypeConfigurations = applyFilters(
				`yoast.seoIntegration.replacementVariables.${ analysisType }.configurations`,
				analysisTypeConfigurations,
				{ analysisType },
			);
			return createReplacementVariables( filteredAnalysisTypeConfigurations );
		},
	);
	const unregisterApplyReplacementVariables = registerApplyReplacementVariables( mapValues( analysisTypeReplacementVariables, "apply" ) );

	return {
		analysisTypeReplacementVariables,
		unregisterApplyReplacementVariables,
	};
};

export default createAnalysisTypeReplacementVariables;
