import { select } from "@wordpress/data";
import { addFilter, removeFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import createReplacementVariables from "@yoast/replacement-variables";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { get, identity, mapValues } from "lodash";

/**
 * Creates the default replacement variable configurations, for use within the SEO store context.
 *
 * There are more replacement variables outside of the SEO store context.
 * @see [Available replacement variables in Yoast SEO for WordPress]{@link https://yoast.com/help/list-available-snippet-variables-yoast-seo/}
 *
 * @returns {Object.<string, ReplacementVariableConfiguration>} The default replacement variable configurations, keyed by name for easy reference.
 */
export const createDefaultReplacementVariableConfigurations = () => ( {
	title: {
		name: "title",
		label: __( "Title", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectTitle(),
	},
	excerpt: {
		name: "excerpt",
		label: __( "Excerpt", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectExcerpt(),
	},
	date: {
		name: "date",
		label: __( "Date", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectDate(),
	},
	focusKeyphrase: {
		name: "focusKeyphrase",
		label: __( "Focus keyphrase", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectKeyphrase(),
		regexp: new RegExp( "%%focuskw%%|%%keyword%%", "g" ),
	},
} );

/**
 * Registers the replacement variables to be used inside the analysis.
 *
 * @param {Object.<string, function>} applies Apply functions, keyed per analysis type.
 *
 * @returns {function} Unregister function.
 */
const registerReplacementVariables = ( applies ) => {
	/**
	 * Creates an apply replacement variables function for objects for the current analysis type.
	 *
	 * @param {Object} paper The paper to analyze.
	 * @param {string} analysisType The current analysis type to apply the replacement variables for.
	 *
	 * @returns {function(Object): string} The apply replacement variables function for objects.
	 */
	const applyReplacementVariables = ( paper, { config: { analysisType } } ) => (
		mapValues( paper, get( applies, analysisType, identity ) )
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
 * @returns {{set: Object.<string, ReplacementVariablesInterface[]>, unregister: function}} The replacement variables interface.
 */
const createAnalysisTypeReplacementVariables = ( configurations ) => {
	const set = mapValues( configurations, createReplacementVariables );
	const unregister = registerReplacementVariables( mapValues( set, "apply" ) );

	return { set, unregister };
};

export default createAnalysisTypeReplacementVariables;
