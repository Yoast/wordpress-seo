import classNames from "classnames";

/**
 * Creates the error ID for the error component.
 *
 * @param {string} inputId The id of the input component.
 *
 * @returns {string} The ID for the error component.
 */
export const getErrorId = ( inputId ) => `error-${ inputId }`;

/**
  * Get props needed to properly display an error in input components.
  *
  * @param {string} inputId The id of the input component.
  * @param {ValidationError} error The error object.
  * @param {boolean} error.isVisible The error object.
  *
  * @returns {Object} Object containing relevant props for displaying.
  */
export const getErrorAriaProps = ( inputId, { isVisible } ) => isVisible ? {
	"aria-invalid": true,
	"aria-describedby": getErrorId( inputId ),
} : {};

/**
 * Helper function to get active styles for select options.
 *
 * @param {boolean} options.active Whether the option is active.
 *
 * @returns {string} Styles for an active option.
 */
export function getOptionActiveStyles( { active, selected } ) {
	return classNames(
		"yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-3 yst-pr-9 yst-my-0",
		selected && "yst-bg-primary-500 yst-text-white",
		( active && ! selected ) && "yst-bg-primary-200 yst-text-gray-700",
		( ! active && ! selected ) && "yst-text-gray-700"
	);
}
