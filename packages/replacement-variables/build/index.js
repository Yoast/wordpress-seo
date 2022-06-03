/**
 * @typedef {Object} ReplacementVariableConfiguration
 *
 * @property {string} name A unique name. By default, this is what is used in the regexp, see below.
 * @property {function: string} getLabel Function that should return the visual label that can be used in the UI.
 * @property {function(Object): string} getReplacement Function that should return the replacement value.
 * @property {RegExp} [regexp] Optional regular expression used to replace, defaults to the name surrounded by `%%`.
 * @property {bool} [isRecommended=false] Optional, whether the replacement variable is recommended to use in the editor.
 * @property {bool} [isVisible=true] Optional, whether the replacement variable is visible in the editor.
 */

/**
 * @typedef {Object} ReplacementVariable
 *
 * @property {string} name A unique name. By default, this is what is used in the regexp, see below.
 * @property {string} label The visual label that can be used in the UI.
 * @property {function(Object): string} getReplacement Function that should return the replacement value.
 * @property {RegExp} regexp Regular expression used to replace.
 * @property {bool} isRecommended Whether the replacement variable is recommended to use in the editor.
 * @property {bool} isVisible Whether the replacement variable is visible in the editor.
 */

/**
 * @typedef {Object} ReplacementVariablesInterface
 *
 * @property {ReplacementVariable[]} variables The list of replacement variables.
 * @property {function(string, Object?): string} apply Applies the replacement variables to a string.
 */
import { map, reduce, curry } from "lodash";
/**
	 * Applies the replacement variables to a string.
	 *
	 * @param {ReplacementVariable[]} variables The input string.
	 * @param {string} string The input string.
	 * @param {Object} [context] Optional single context argument for the `getReplacement` functions.
	 *
	 * @returns {string} The string, but with any replacement variables replaced.
	 */

export const applyReplacementVariables = curry(function (variables, string) {
  let context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return reduce(variables, (replaced, _ref) => {
    let {
      regexp,
      getReplacement
    } = _ref;
    return regexp.test(replaced) ? replaced.replace(regexp, getReplacement(context)) : replaced;
  }, string);
});
/**
 * Creates replacement variables and provides an apply function.
 *
 * @param {ReplacementVariableConfiguration[]} configurations The replacement variable configurations.
 *
 * @returns {ReplacementVariablesInterface} The replacement variables and an apply function.
 */

const createReplacementVariables = configurations => {
  const variables = map(configurations, function () {
    let {
      name,
      getLabel,
      getReplacement,
      regexp = null,
      isRecommended = false,
      isVisible = true
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      name,
      label: getLabel(),
      getReplacement,
      regexp: regexp || new RegExp(`%%${name}%%`, "g"),
      isRecommended,
      isVisible
    };
  });
  return {
    variables,
    apply: applyReplacementVariables(variables)
  };
};

export default createReplacementVariables;
//# sourceMappingURL=index.js.map