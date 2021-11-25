/**
 * @typedef {Object} ReplacementVariableConfiguration
 *
 * @property {string} name A unique name. By default this is what is used in the regexp, see below.
 * @property {string} label The visual label that can be used in the UI.
 * @property {function(Object): string} getReplacement Function that should return the replacement value.
 * @property {RegExp} [regexp] Optional regular expression used to replace, defaults to the name surrounded by `%%`.
 */

/**
 * @typedef {Object} ReplacementVariable
 *
 * @property {string} name A unique name. By default this is what is used in the regexp, see below.
 * @property {string} label The visual label that can be used in the UI.
 * @property {function(Object): string} getReplacement Function that should return the replacement value.
 * @property {RegExp} regexp Regular expression used to replace.
 */

/**
 * @typedef {Object} ReplacementVariablesInterface
 *
 * @property {ReplacementVariable[]} variables A unique name. By default this is what is used in the regexp, see below.
 * @property {function(string, Object?): string} apply Applies the replacement variables to a string.
 */

import { reduce, map } from "lodash";

/**
 * Creates replacement variables and provides an apply function.
 *
 * @param {ReplacementVariableConfiguration[]} configurations The replacement variable configurations.
 *
 * @returns {ReplacementVariablesInterface} The replacement variables and an apply function.
 */
const createReplacementVariables = ( configurations ) => {
	const variables = map( configurations, ( { name, label, getReplacement, regexp = null } = {} ) => ( {
		name,
		label,
		getReplacement,
		regexp: regexp || new RegExp( `%%${ name }%%`, "g" ),
	} ) );

	/**
	 * Applies the replacement variables to a string.
	 *
	 * @param {string} input The input string.
	 * @param {Object} [context] Optional single context argument for the `getReplacement` functions.
	 *
	 * @returns {string} The input, but with any replacement variables replaced.
	 */
	const apply = ( input, context = {} ) => reduce(
		variables,
		( replaced, { regexp, getReplacement } ) => (
			regexp.test( replaced )
				? replaced.replace( regexp, getReplacement( context ) )
				: replaced
		),
		input,
	);

	return {
		variables,
		apply,
	};
};

export default createReplacementVariables;
