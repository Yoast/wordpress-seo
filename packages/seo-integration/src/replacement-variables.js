import { select } from "@wordpress/data";
import { addFilter, removeFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import createReplacementVariables from "@yoast/replacement-variables";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { curryRight, mapValues, noop, reduce, unionBy } from "lodash";

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
 * Merges two sets of replacement variable configurations, by name.
 *
 * @param {ReplacementVariableConfiguration[]} default Default set. An entry will be overriden whenever its name is not unique.
 * @param {ReplacementVariableConfiguration[]} preferred Preferred set. Possibly overrides the default set.
 *
 * @returns {ReplacementVariableConfiguration[]} Replacement variable configurations.
 */
export const mergeReplacementVariableConfigurations = curryRight( unionBy )( "name" );

/**
 * Creates an apply replacement variables function for objects.
 *
 * @param {function} apply The apply replacement variables function for strings.
 *
 * @returns {function(Object): string} The apply replacement variables function for objects.
 */
const createApplyReplacementVariablesToObject = apply => source => reduce(
	source,
	( result, value, key ) => ( { ...result, [ key ]: apply( value ) } ),
	{},
);

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
	 * @returns {function(Object): string} The apply replacement variables function for objects.
	 */
	const applyReplacementVariables = () => {
		const analysisType = select( SEO_STORE_NAME ).selectAnalysisType();

		return createApplyReplacementVariablesToObject( applies[ analysisType ] || noop );
	};

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
 * @returns {{set: Object.<string, ReplacementVariable[]>, unregister: function}} The replacement variables interface.
 */
const createAnalysisTypeReplacementVariables = ( configurations ) => {
	const set = reduce(
		configurations,
		( acc, value, key ) => ( { ...acc, [ key ]: createReplacementVariables( value ) } ),
		{},
	);

	const unregister = registerReplacementVariables( mapValues( set, "apply" ) );

	return { set, unregister };
};

export default createAnalysisTypeReplacementVariables;
