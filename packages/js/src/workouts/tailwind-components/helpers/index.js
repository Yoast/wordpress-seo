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

