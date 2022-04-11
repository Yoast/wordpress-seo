import { sortBy } from "lodash";

/**
 * Maps over a list of checked checkboxes elements and returns the value and the text content, ordered alphabetically.
 *
 * @param {Array} checkedCheckboxes The array of checked checkboxes to map.
 *
 * @returns {Object[]} An array containing objects with the checked checkboxes value and text content,
 * with the objects ordered alphabetically based on the object's text content.
 */
export const getValuesFromCheckboxes = ( checkedCheckboxes ) => {
	const checkboxes = checkedCheckboxes.map( checkbox => (
		{
			id: checkbox.value,
			name: [ ...checkbox.parentElement.childNodes ]
				.filter( node => node.nodeType === Node.TEXT_NODE )
				.map( node => node.textContent )[ 0 ]
				?.trim(),
		}
	) );

	return sortBy( checkboxes, checkbox => checkbox.name.toLowerCase() );
};
