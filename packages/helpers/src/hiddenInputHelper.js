/**
 * Returns the hidden input using a JS querySelector.
 *
 * @param {string} id The hidden input ID.
 *
 * @returns {object|null} The Hidden Input or null.
 */
const getHiddenInput = ( id ) => {
	return document.querySelector( id );
};

/**
 * Updates the value of a hiddenInput and calls the onChange function.
 *
 * @param {string} hiddenInputId The ID of the hiddenInputField.
 * @param {function} onChange The onChange function.
 *
 * @returns {function} The updateInput function.
 */
export const curryUpdateToHiddenInput = ( hiddenInputId, onChange = null ) => {
	return value => {
		const hiddenInput = getHiddenInput( hiddenInputId );
		if ( hiddenInput ) {
			const updateValue = Array.isArray( value ) ? value.join( "," ) : value;
			hiddenInput.value = updateValue;
		}
		if ( onChange ) {
			onChange( value );
		}
	};
};

/**
 * Gets the value from a hidden input.
 *
 * @param {string} hiddenInputId The ID of the hidden input.
 *
 * @returns {string|null} The value of the hidden input or null.
 */
export const getValueFromHiddenInput = ( hiddenInputId ) => {
	const component = getHiddenInput( hiddenInputId );
	if ( component ) {
		return component.value;
	}

	return null;
};
