import { reduce } from "lodash";

/**
 * @typedef {Object} ReplacementVariableConfiguration
 *
 * @property {string} name A unique name. By default this is what is used in the regexp, see below.
 * @property {string} label The visual label that can be used in the UI.
 * @property {function} getReplacement Function that should return the replacement value.
 * @property {RegExp} [regexp] Optional regular expression used to replace, defaults to the name surrounded by `%%`.
 */

/**
 * @typedef {Object} ReplacementVariable
 *
 * @property {string} name A unique name. By default this is what is used in the regexp, see below.
 * @property {string} label The visual label that can be used in the UI.
 * @property {function} getReplacement Function that should return the replacement value.
 * @property {RegExp} regexp Regular expression used to replace.
 */

/**
 * Creates replacement variables and provides an apply function.
 *
 * @param {ReplacementVariableConfiguration[]} configurations The replacement variable configurations.
 *
 * @returns {{variables: ReplacementVariable[], apply: function}} The replacement variables and an apply function.
 */
const createReplacementVariables = ( configurations ) => {
	const variables = configurations.map( ( { name, label, getReplacement, regexp = null } = {} ) => ( {
		name,
		label,
		getReplacement,
		regexp: regexp || new RegExp( `%%${ name }%%`, "g" ),
	} ) );

	/**
	 * Applies the replacement variables to a string.
	 *
	 * @param {string} input The input string.
	 * @param {Object} context The single context argument for the `getReplacement` functions.
	 *
	 * @returns {string} The input, but with any replacement variables replaced.
	 */
	const apply = ( input, context ) => reduce(
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
